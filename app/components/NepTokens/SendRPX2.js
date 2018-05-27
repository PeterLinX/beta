import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import Neon from "@cityofzion/neon-js";
import { doSendAsset, verifyAddress, getRPCEndpoint } from "neon-js";
import { api, wallet, sc, rpc, u } from "@cityofzion/neon-js";
import Modal from "react-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../../util/Logs";
import rpxLogo from "../../img/rpx.png";
import Assets from "./../Assets";
import { clipboard } from "electron";
import { togglePane } from "../../modules/dashboard";
import {
  sendEvent,
  clearTransactionEvent,
  toggleAsset
} from "../../modules/transactions";
import { ASSETS, TOKENS, TOKENS_TEST } from "../../core/constants";
import { flatMap, keyBy, get, omit, pick } from "lodash";
import numeral from "numeral";
import RPXChart from "./../NepCharts/RPXChart";
import NEPQRModalButton from "./../Assets/NEPQRModalButton.js";
import TopBar from "./../TopBar";
import Search from "./../Search";
import {BIP44_PATH} from "../../core/constants";

let sendAddress, sendAmount, confirmButton, scriptHash, rpx_usd, gas_usd;
let encodeTransactionResponse='';
let signature =  undefined;
let signatureInfo = '';
let signedTransaction = '';
let sentTransactionInfo = '';
const neonJsApi = require( 'neon-js' );
const comm_node = require('ledger-node-js-api');

const PREFIX = 'spunky';
export const AUTH_ID = 'AUTH'

const getSigningFunction = (state) => {
    return get(state, `${PREFIX}.${AUTH_ID}.data.address`)
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    },
    content: {
        margin: "100px auto 0",
        padding: "30px 30px 30px 30px",
        border: "4px solid #222",
        background: "rgba(12, 12, 14, 1)",
        borderRadius: "20px",
        top: "100px",
        height: 260,
        width: 600,
        left: "100px",
        right: "100px",
        bottom: "100px",
        boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
    }
};

const apiURL = val => {
  return "https://min-api.cryptocompare.com/data/price?fsym=RPX&tsyms=USD";
};

const apiURLForGas = val => {
  return "https://min-api.cryptocompare.com/data/price?fsym=GAS&tsyms=USD";
};

const isToken = symbol => {
  ![ASSETS.NEO, ASSETS.GAS].includes(symbol);
};
// form validators for input fields
const validateForm = (dispatch, rpx_balance) => {
  // check for valid address
  try {
    if (
      verifyAddress(sendAddress.value) !== true ||
      sendAddress.value.charAt(0) !== "A"
    ) {
      dispatch(sendEvent(false, "The address you entered was not valid."));
      setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      return false;
    }
  } catch (e) {
    dispatch(sendEvent(false, "The address you entered was not valid."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  }
  // check for fractional neo
  if (
      parseInt(sendAmount.value) > rpx_balance) {
    // check for value greater than account balance
    dispatch(sendEvent(false, "You do not have enough RPX to send."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  }  else if (parseFloat(sendAmount.value) <= 0) {
    // check for negative asset
    dispatch(sendEvent(false, "You cannot send negative amounts of an asset."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  }
  return true;
};

// open confirm pane and validate fields
const openAndValidate = (dispatch, neo_balance, gas_balance, asset) => {
  if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
    dispatch(togglePane("confirmPane"));
  }
};

const extractAssets = sendEntries => {
  //: Array<SendEntryType>
  return sendEntries.filter(({ symbol }) => !isToken(symbol));
};

const buildIntents = sendEntries => {
  //: Array<SendEntryType>
  const assetEntries = extractAssets(sendEntries);
  // $FlowFixMe
  return flatMap(assetEntries, ({ address, amount, symbol }) =>
    api.makeIntent(
      {
        [symbol]: Number(amount)
      },
      address
    )
  );
};

const buildIntentsForInvocation = (
  sendEntries, //: Array<SendEntryType>,
  fromAddress
) => {
  //const intents = buildIntents(sendEntries)
  const intents = [];
  console.log("intents = " + JSON.stringify(intents));

  if (intents.length > 0) {
    return intents;
  } else {
    return buildIntents([
      {
        address: fromAddress,
        amount: "0.00000001",
        symbol: ASSETS.GAS
      }
    ]);
  }
};

const buildTransferScript = (
  net,
  sendEntries, //: Array<SendEntryType>,
  fromAddress,
  tokensBalanceMap //: {
  //     [key: string]: TokenBalanceType
  // }
) => {
  // const tokenEntries = extractTokens(sendEntries);
  //console.log("tokenEntries = " + tokenEntries);
  const fromAcct = new wallet.Account(fromAddress);
  console.log("fromAcct = " + JSON.stringify(fromAcct));
  const scriptBuilder = new sc.ScriptBuilder();
  console.log("scriptBuilder = " + scriptBuilder);

  sendEntries.forEach(({ address, amount, symbol }) => {
    const toAcct = new wallet.Account(address);
    console.log("toAcct = " + JSON.stringify(toAcct));
    const scriptHash = tokensBalanceMap[symbol].scriptHash;
    console.log("Script Hash = " + scriptHash);
    const decimals = tokensBalanceMap[symbol].decimals;
    console.log("decimals = " + decimals);
    const args = [
      u.reverseHex(fromAcct.scriptHash),
      u.reverseHex(toAcct.scriptHash),
      sc.ContractParam.byteArray(Number(amount), "fixed8", decimals)
    ];

    scriptBuilder.emitAppCall(scriptHash, "transfer", args);
  });

  return scriptBuilder.str;
};

const makeRequest = (sendEntries, config) => {
  //: Array<SendEntryType> ,: Object
  console.log("config = " + JSON.stringify(config));
  const script = buildTransferScript(
    config.net,
    sendEntries,
    config.address,
    config.tokensBalanceMap
  );

  console.log("buildTransferScript = " + script);
  return api.doInvoke({
    ...config,
    intents: buildIntentsForInvocation(sendEntries, config.address),
    script,
    gas: 0
  });
};


const getTokenBalance = async (net,address,token) => {
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log("endpoint = "+endpoint);
    const  scriptHash  = token;
    try {
        const response = await api.nep5.getToken("http://seed1.bridgeprotocol.io:10332", scriptHash, address);
        console.log("nep5 balance response = "+JSON.stringify(response));
        return response.balance;

    }
    catch (err) {
        // invalid scriptHash
        console.log("invalid scriptHash")
        return 0;
    }
}


const encodeTransactionAndcreateSignature =
async(net,selfAddress,wif,account) => {
    let balance = await api.neoscan.getBalance(net, selfAddress);
    let balanceInfo = JSON.stringify( balance );
    console.log( "balance " + balanceInfo + "\n" );

    let script;
    if (net == "MainNet") {
        script = TOKENS.RPX;
    } else {
        script = TOKENS_TEST.RPX;
    }
    console.log( "script " + script + "\n" );

    let asset = "RPX";
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log( "asset " + asset + "\n" );



    let fromAccount = account;
    console.log("fromAccount = "+JSON.stringify(fromAccount));

    let balanceNep5Info = await getTokenBalance(net,selfAddress,script);
    console.log(balanceNep5Info);

    let neoScan = await api.neoscan.getBalance(net,selfAddress);
    let neoScanInfo = JSON.stringify( neoScan );
    console.log( "neoScan " + neoScanInfo + "\n" );

    if (balanceNep5Info !== null && balanceNep5Info !== undefined) {

        const coinsData = {
            "assetid": script,
            "list": balance.unspent[asset],
            "balance": parseInt(balanceNep5Info),
            "name": asset
        };

        console.log(coinsData);

        encodeTransactionResponse = neonJsApi.transferTransaction(coinsData, fromAccount._publicKey, sendAddress.value, sendAmount.value);
        console.log("encodeTransaction encodeTransactionResponse " + encodeTransactionResponse + "\n");


        // Create Signature
        let textToSign = encodeTransactionResponse + BIP44_PATH;
        signatureInfo = "Ledger Signing Text of Length [" + textToSign.length + "], Please Confirm Using the Device's Buttons. " + textToSign;

        console.log(signatureInfo + "\n");
        var validStatus = [0x9000];

        var messages = [];

        let bufferSize = 255 * 2;
        let offset = 0;

        console.log("textToSign.length " + textToSign.length)

        while (offset < textToSign.length) {
            let chunk;
            let p1;
            if (( textToSign.length - offset ) > bufferSize) {
                chunk = textToSign.substring(offset, offset + bufferSize);
            } else {
                chunk = textToSign.substring(offset);
            }
            if (( offset + chunk.length ) == textToSign.length) {
                p1 = "80";
            } else {
                p1 = "00";
            }

            let chunkLength = chunk.length / 2;

            console.log("Ledger Signature chunkLength " + chunkLength + "\n");

            let chunkLengthHex = chunkLength.toString(16);
            while (chunkLengthHex.length < 2) {
                chunkLengthHex = "0" + chunkLengthHex;
            }

            console.log("Ledger Signature chunkLength hex " + chunkLengthHex + "\n");

            messages.push("8002" + p1.toString() + "00" + chunkLengthHex.toString() + chunk.toString());
            offset += chunk.length;
        }

        await comm_node.create_async(0, false).then(function (comm) {
            for (let ix = 0; ix < messages.length; ix++) {
                let message = messages[ix];
                console.log("Ledger Message (" + ix +
                    "/" + messages.length +
                    ") " + message + "\n");

                comm.exchange(message, validStatus).then(function (response) {
                    console.log("Ledger Signature Response " + response + "\n");
                    if (response != "9000") {
                        comm.device.close();

                        let rLenHex = response.substring(6, 8);
                        // process.stdout.write( "Ledger Signature rLenHex " + rLenHex + "\n" );
                        let rLen = parseInt(rLenHex, 16) * 2;
                        // process.stdout.write( "Ledger Signature rLen " + rLen + "\n" );
                        let rStart = 8;
                        // process.stdout.write( "Ledger Signature rStart " + rStart + "\n" );
                        let rEnd = rStart + rLen;
                        // process.stdout.write( "Ledger Signature rEnd " + rEnd + "\n" );

                        while (( response.substring(rStart, rStart + 2) == "00" ) && ( ( rEnd - rStart ) > 64 )) {
                            rStart += 2;
                        }

                        let r = response.substring(rStart, rEnd);
                        console.log("Ledger Signature R [" + rStart + "," + rEnd + "]:" + ( rEnd - rStart ) + " " + r + "\n");
                        let sLenHex = response.substring(rEnd + 2, rEnd + 4);
                        // process.stdout.write( "Ledger Signature sLenHex " + sLenHex + "\n" );
                        let sLen = parseInt(sLenHex, 16) * 2;
                        // process.stdout.write( "Ledger Signature sLen " + sLen + "\n" );
                        let sStart = rEnd + 4;
                        // process.stdout.write( "Ledger Signature sStart " + sStart + "\n" );
                        let sEnd = sStart + sLen;
                        // process.stdout.write( "Ledger Signature sEnd " + sEnd + "\n" );

                        while (( response.substring(sStart, sStart + 2) == "00" ) && ( ( sEnd - sStart ) > 64 )) {
                            sStart += 2;
                        }

                        let s = response.substring(sStart, sEnd);
                        console.log("Ledger Signature S [" + sStart + "," + sEnd + "]:" + ( sEnd - sStart ) + " " + s + "\n");

                        let msgHashStart = sEnd + 4;
                        let msgHashEnd = msgHashStart + 64;
                        let msgHash = response.substring(msgHashStart, msgHashEnd);
                        console.log("Ledger Signature msgHash [" + msgHashStart + "," + msgHashEnd + "] " + msgHash + "\n");

                        signature = r + s;
                        signatureInfo = "Signature of Length [" + signature.length + "] : " + signature;
                        console.log(signatureInfo + "\n");

                        //console.log( "Check Signature of Length [" + checkSignature.length + "] : " + checkSignature + "\n" );
                    }
                })
                    .catch(function (reason) {
                        comm.device.close();
                        signatureInfo = "An error occured[1]: " + reason;
                        console.log("Signature Reponse " + signatureInfo + "\n");
                        dispatch(sendEvent(false, "Transaction failed!"));
                        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                    });
            }
        })
            .catch(function (reason) {
                comm.device.close();
                signatureInfo = "An error occured[2]: " + reason;
                console.log("Signature Reponse " + signatureInfo + "\n");
                dispatch(sendEvent(false, "Transaction failed!"));
                setTimeout(() => dispatch(clearTransactionEvent()), 1000);
            });
    } else {
        dispatch(sendEvent(false, "Transaction failed!"));
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    }
}


const queryRPC = (net, method, params, id = 1) => {
    const jsonRequest = axios.create({
            headers: { 'Content-Type': 'application/json' }
        }),
        jsonRpcData = {
            method,
            params,
            id,
            jsonrpc: '2.0'
        };
    return getRPCEndpoint(net).then((rpcEndpoint) => {
        return jsonRequest.post(rpcEndpoint, jsonRpcData).then((response) => response.data);
    });
};

const signAndsendTransaction = async (dispatch , net, account) => {
    //Sign Transaction
    let fromAccount = account;
    signedTransaction = neonJsApi.addContract( encodeTransactionResponse, signature, fromAccount._publicKey );

    // Send Transaction
    console.log( "sendrawtransaction " + signedTransaction + "\n" );
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    //let sentTransaction = await rpc.queryRPC( endpoint, "sendRawTransaction", [signedTransaction], 4 );

    let sentTransaction = await queryRPC( net, "sendrawtransaction", [signedTransaction], 4 )
    sentTransactionInfo = JSON.stringify( sentTransaction );
    console.log( "sentTransaction " + sentTransactionInfo + "\n" );
    dispatch(
        sendEvent(
            true,
            "Transaction complete! Your balance will automatically update when the blockchain has processed it."
        )
    );

    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
}



// perform send transaction for RPX
const sendRpxTransaction = async (
  dispatch,
  net,
  selfAddress,
  wif,
  isHardwareLogin,
  account
  ) => {
  const endpoint = await api.neonDB.getRPCEndpoint(net);
  console.log("endpoint = " + endpoint);
  let script;
  if (net == "MainNet") {
    script = TOKENS.RPX;
  } else {
    script = TOKENS_TEST.RPX;
  }
  const token_response = await api.nep5.getToken(endpoint, script, selfAddress);
  const rpx_balance = token_response.balance;
  console.log("token_response = " + JSON.stringify(token_response));
  const tokenBalances = {
    name: token_response.name,
    symbol: token_response.symbol,
    decimals: token_response.decimals,
    totalSupply: token_response.totalSupply,
    balance: token_response.balance,
    scriptHash: script
  };
  const isHardwareSend = isHardwareLogin;
  let state = {
      address: selfAddress,
      wif: wif
  }
  const signingFunction = getSigningFunction(state);
  const tokensBalanceMap = {
    RPX: tokenBalances
  }; //keyBy(tokenBalances, 'symbol');
  console.log("tokensBalanceMap = " + JSON.stringify(tokensBalanceMap));
  let privateKey = new wallet.Account(wif).privateKey;
  let publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
  console.log("public Key = " + publicKey);
  //sendEntries ,// Array<SendEntryType>,
  let sendEntries = new Array();
  var sendEntry = {
    amount: sendAmount.value.toString(),
    address: sendAddress.value.toString(),
    symbol: "RPX"
  };
  sendEntries.push(sendEntry);
  console.log("sendEntries = " + JSON.stringify(sendEntries));

  if (isHardwareSend) {
      dispatch(sendEvent(false, "Please sign the transaction on your hardware device."));
      setTimeout(() => dispatch(clearTransactionEvent()), 2000);
  }

  if (validateForm(dispatch,rpx_balance) === true) {
      if (rpx_balance <= sendAmount.value) {
          dispatch(sendEvent(false, "You are trying to send more RPX than you have available."));
          setTimeout(() => dispatch(clearTransactionEvent()), 2000);
          return true;
      } else {
          dispatch(sendEvent(true, "Sending RPX...\n"));
          try {
              const { response } = await makeRequest(sendEntries, {
                  net,
                  tokensBalanceMap,
                  address: selfAddress,
                  undefined,
                  privateKey: privateKey,
                  signingFunction: isHardwareSend ? signingFunction : null
              });
              console.log("sending rpx response=" + response.result);
              if (!response.result) {
                  dispatch(sendEvent(false, "Sorry, your transaction failed. Please try again soon."));
                  setTimeout(() => dispatch(clearTransactionEvent()), 2000);
              } else {
                  dispatch(sendEvent(false,
            "Transaction complete! Your balance will automatically update when the blockchain has processed it." ));
                  setTimeout(() => dispatch(clearTransactionEvent()), 2000);
              }
          } catch (err) {
              console.log("sending rpx =" + err.message);
              dispatch(sendEvent(false, "There was an error processing your trasnaction. Please check and try again."));
              setTimeout(() => dispatch(clearTransactionEvent()), 2000);
              return false;
          }
      }
  }

};


const StatusMessage = ({ sendAmount, sendAddress, handleCancel, handleConfirm, asset }) => {
    let message = null;
    message = (
        <Modal
            isOpen={true}
            closeTimeoutMS={5}
            style={styles}
            contentLabel="Modal"
            ariaHideApp={false}
        >
          <div>
            <div className="center modal-alert">
            </div>
            <div className="center modal-alert top-20">
              <strong>Confirm sending {sendAmount} RPX to {sendAddress}by selecting Sign Tx on your Ledger Nano S.</strong>
            </div>
            <div className="row top-30">
            <div className="col-xs-6">
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
            <div className="col-xs-6">
              <button className="btn-send" onClick={handleConfirm}>Confirm</button>
            </div>
            </div>
          </div>
        </Modal>
    );
    return message;
};

class SendRPX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      gas: "0",
      neo: "0",
      neo_usd: "0",
      gas_usd: "0",
      value: "0",
      inputEnabled: true,
      fiatVal: 0,
      tokenVal: 0,
      modalStatus: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUSD = this.handleChangeUSD.bind(this);
  }

  async componentDidMount() {
    let neo = await axios.get(apiURL("NEO"));
    let gas = await axios.get(apiURL("GAS"));
    neo = neo.data.USD;
    gas = gas.data.USD;
    this.setState({ neo: neo, gas: gas });
  }

  handleChange(event) {
    this.setState({ value: event.target.value }, (sendAmount = value));
    const value = event.target.value * this.state.neo;
    this.setState({ fiatVal: value });
  }

  async handleChangeUSD(event) {
    this.setState({ fiatVal: event.target.value });
    let gas = await axios.get(apiURL("GAS"));
    gas = gas.data.USD;
    this.setState({ gas: gas });
    const value = this.state.fiatVal / this.state.gas;
    this.setState({ value: value }, () => {
      sendAmount = value;
    });
  }

  render() {
    const {
      dispatch,
      wif,
      address,
      status,
      neo,
      gas,
      net,
      confirmPane,
      selectedAsset,
      rpx,
      isHardwareLogin,
      account
    } = this.props;
    return this.props.isHardwareLogin?(
            <div>
                <div className="breadBar">
          <div className="col-flat-10">
              <ol id="no-inverse" className="breadcrumb">
                  <li><Link to="/">Logout</Link></li>
                  <li className="active">Send</li>
              </ol>
          </div>
          <div className="col-flat-2">
              <Search />
          </div>
                </div>

                <TopBar />
                <Assets />
                {
          this.state.modalStatus?
              <StatusMessage
                  sendAmount={sendAmount.value}
                  sendAddress={sendAddress.value}
                  handleCancel = {
            () => {
                this.setState({
          modalStatus: false
                })
            }
                  }
                  handleConfirm ={() => {
            signAndsendTransaction(dispatch, net,account);
            this.setState({
                modalStatus: false
            })
                  }}
              />
              :
              null
                }

                <div id="send">
          <div className="row dash-chart-panel">


              <div className="col-xs-6">
                  <img
            src={rpxLogo}
            alt=""
            width="38"
            className="neo-logo fadeInDown"
                  />
                  <h2>Send </h2>
              </div>
              <div className="col-xs-3" />
              <div className="col-xs-3 top-20 center com-soon">
                  Block: {this.props.blockHeight}
              </div>

              <div className="col-xs-12 center">
                  <hr className="dash-hr-wide" />
              </div>

              <div className="clearboth" />

              <div className="top-20">
                  <div className="col-xs-9">
            <input
                className="form-send-rpx"
                id="center"
                placeholder="Enter a valid NEO public address here"
                ref={node => {
          sendAddress = node;
                }}
            />
                  </div>


                  <div className="col-xs-5  top-20">
            <input
                className="form-send-rpx"
                type="number"
                id="assetAmount"
                min="1"
                onChange={this.handleChange}
                value={this.state.value}
                placeholder="Enter amount to send"
                ref={node => {
          sendAmount = node;
                }}
            />
            <div className="clearboth"/>
            <span className="com-soon block top-10">Amount in RPX to send</span>
                  </div>
                  <div className="col-xs-4 top-20">
            <input
                className="form-send-rpx"
                id="sendAmount"
                onChange={this.handleChangeUSD}
                placeholder="Amount in US"
                value={`${this.state.fiatVal}`}
            />
            <label className="amount-dollar">$</label>
            <div className="clearboth"/>
            <span className="com-soon block top-10">Calculated in USD</span>
                  </div>

                  <div className="col-xs-3 top-20">
            <button
                className="grey-button"
                onClick={
          ()=>{
              if (sendAddress.value === '') {
                  dispatch(sendEvent(false, "You can not send without address."));
                  setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                  return false;
              }


              if (parseFloat(sendAmount.value) <= 0) {
                  dispatch(sendEvent(false, "You cannot send negative amounts."));
                  setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                  return false;
              }

              encodeTransactionAndcreateSignature(net,address,wif,account);

              this.setState({
                  modalStatus: true
              })
          }
                }
            >
                Send
            </button>

                  </div>
              </div>
          </div>
                </div>
                <div >
          <input className="form-send-white" value={encodeTransactionResponse} />
          <input className="form-send-white" value={signatureInfo} />
          <input className="form-send-white" value={signedTransaction} />
          <input className="form-send-white" value={sentTransactionInfo} />
                </div>
            </div>
        ) : (
      <div>
          {
              this.state.modalStatus?
                  <StatusMessage
            sendAmount={sendAmount.value}
            sendAddress={sendAddress.value}
            handleCancel = {
                () => {
          this.setState({
              modalStatus: false
          })
                }
            }
            handleConfirm ={() => {
                sendRpxTransaction(
          dispatch, net, address, wif, isHardwareLogin)
                this.setState({
          modalStatus: false
                })
            }}
                  />
                  :
                  null
          }
          <div className="breadBar">
          <div className="col-flat-10">
          <ol id="no-inverse" className="breadcrumb">
          <li><Link to="/assetPortfolio">Portfolio</Link></li>
          <li className="active">Red Pulse</li>
          </ol>
          </div>

          <div className="col-flat-2">
          <Search />
          </div>
          </div>

        <TopBar />
        <div id="send">
          <div className="row dash-panel">
            <div className="col-xs-5">
              <img
                src={rpxLogo}
                alt=""
                width="96"
                className="neo-logo fadeInDown"
              />
              <h2>Red Pulse</h2>
              <hr className="dash-hr-wide" />
              <span className="market-price"> {numeral(this.props.marketRPXPrice).format("$0,0.00")} each</span><br />
              <span className="font24">{numeral(
                Math.floor(this.props.rpx * 100000) / 100000
              ).format("0,0.0000")} <span id="no-inverse" className="rpx-price"> RPX</span></span><br />
              <span className="market-price"> {numeral(this.props.rpx * this.props.marketRPXPrice).format("$0,0.00")} </span>
            </div>

            <div className="col-xs-7 center">
            <RPXChart />
            </div>

            <div className="col-xs-12 center">
              <hr className="dash-hr-wide top-20" />
            </div>

            <div className="clearboth" />

            <div className="top-20">
              <div className="col-xs-9">
                <input
                  className="form-send-rpx"
                  id="center"
                  placeholder="Enter a valid RPX public address here"
                  ref={node => {
          sendAddress = node;
                  }}
                />
              </div>
							<Link>
              <div className="col-xs-3">
                <NEPQRModalButton />
              </div>
							</Link>

              <div className="col-xs-5 top-20">
                <input
                  className="form-send-rpx"
                  type="number"
                  id="assetAmount"
                  min="1"
                  onChange={this.handleChange}
                  value={this.state.value}
                  placeholder="Enter amount to send"
                  ref={node => {
          sendAmount = node;
                  }}
                />
                <div className="clearboth" />
                <span className="com-soon block top-10">
                  Amount in RPX to send
                </span>
              </div>
              <div className="col-xs-4 top-20">
                <input
                  className="form-send-rpx"
                  id="sendAmount"
                  onChange={this.handleChangeUSD}
                  placeholder="Amount in US"
                  value={`${this.state.fiatVal}`}
                />
                <label className="amount-dollar">$</label>
                <div className="clearboth" />
                <span className="com-soon block top-10">Calculated in USD</span>
              </div>
              <div className="col-xs-3 top-20">
                <div id="sendAddress">
                  <button
          className="rpx-button"
          onClick={() => {
              if (sendAddress.value === '') {
                  dispatch(sendEvent(false, "Please enter a valid address."));
                  setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                  return false;
              }


              if (parseFloat(sendAmount.value) <= 0) {
                  dispatch(sendEvent(false, "You cannot send negative amounts of an RPX."));
                  setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                  return false;
              }

              this.setState({
                  modalStatus: true
              })
          }
          }


          ref={node => {
            confirmButton = node;
          }}
                  >
          <span className="glyphicon glyphicon-send marg-right-5" />{" "}
          Send
                  </button>
                </div>
              </div>
            </div>

          <div className="clearboth" />
          <div className="send-notice">
            <p>
              Sending RedPulse (RPX) NEP5 tokens require a balance of 0.00000001 GAS+. Only send RPX to a valid address that supports NEP5+ tokens on the NEO blockchain. When sending RPX to an exchange please ensure the address supports RPX tokens.
            </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  wif: state.account.wif,
  isHardwareLogin: state.account.isHardwareLogin,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  marketRPXPrice: state.wallet.marketRPXPrice,
  selectedAsset: state.transactions.selectedAsset,
  confirmPane: state.dashboard.confirmPane,
  rpx: state.wallet.Rpx,
    account: state.account.account
});

SendRPX = connect(mapStateToProps)(SendRPX);

export default SendRPX;
