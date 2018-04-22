import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
//import Modal from "react-bootstrap-modal";
import Modal from "react-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import litecoinLogo from "../img/litecoin.png";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
  sendEvent,
  clearTransactionEvent,
  toggleAsset
} from "../modules/transactions";
import { BLOCK_TOKEN } from "../core/constants";
import TransactionHistoryLTC from "./TransactionHistoryLTC";
import {
  syncTransactionHistory,
  syncLtcTransactionHistory,
  block_index
} from "../components/NetworkSwitch";
import { ltcLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { setCombinedBalance } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";
import LTCChart from "./NepCharts/LTCChart";
import LTCQRModalButton from "./LTCQRModalButton.js";

var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var litecoin = bitcoin.networks.litecoin;
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require("coinkey");
let sendAddress, sendAmount, confirmButton;

const refreshBalance = (dispatch, net, address ,btc ,ltc ,eth) => {
  initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth).then(response => {
    dispatch(sendEvent(true, "Prices and balances updated."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

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
  return "https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD";
};

const apiURLFor = val => {
  return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};

const getUnspentOutputsForLtc = async (net, address) => {
  let base;
  if (net === "MainNet") {
    base = `https://live.blockcypher.com/ltc/address/${address}/utxo`;
  } else {
    base = `https://live.blockcypher.com/ltc-testnet/address/${address}/utxo`;
  }
  var response = await axios.get(base);
  console.log(response.data);
  return response.data;
};

// form validators for input fields

// form validators for input fields
const validateForm = (dispatch, asset, net) => {
  // check for valid address
  if (net === "MainNet") {
    var validMain = WAValidator.validate(sendAddress.value, "litecoin");
    if (validMain) {
      return true;
    } else {
      dispatch(sendEvent(false, "The address you entered was not valid."));
      setTimeout(() => dispatch(clearTransactionEvent()), 2000);
      return false;
    }
  } else {
    var validTest = WAValidator.validate(
      sendAddress.value,
      "litecoin",
      "testnet"
    );
    if (validTest) {
      return true;
    } else {
      dispatch(sendEvent(false, "The address you entered was not valid."));
      setTimeout(() => dispatch(clearTransactionEvent()), 2000);
      return false;
    }
  }
};

// open confirm pane and validate fields
const openAndValidate = (dispatch, neo_balance, gas_balance, asset) => {
  if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
    dispatch(togglePane("confirmPane"));
  }
};

// perform send transaction
const sendTransaction = (
  dispatch,
  net,
  selfAddress,
  wif,
  asset,
  neo_balance,
  gas_balance,
  ltc_balance
) => {
  // validate fields again for good measure (might have changed?)
  if (validateForm(dispatch, asset, net) === true) {
    dispatch(sendEvent(true, "Processing..."));

    log(net, "SEND", selfAddress, {
      to: sendAddress.value,
      asset: asset,
      amount: sendAmount.value
    });
    console.log("Display ltc balance\n");
    console.log(ltc_balance);
    //Send bitcoin
    let send_amount = parseFloat(sendAmount.value);

    if (ltc_balance <= 0) {
      dispatch(
        sendEvent(
          false,
          "Sorry, transaction failed. Please try again in a few minutes."
        )
      );
      setTimeout(() => dispatch(clearTransactionEvent()), 2000);
      return false;
    } else if (ltc_balance < sendAmount.value) {
      dispatch(
        sendEvent(
          false,
          "Your LTC balance is less than the amount your are sending."
        )
      );
      setTimeout(() => dispatch(clearTransactionEvent()), 2000);
      return false;
    } else {
      let new_base, send_base;
      let satoshi_amount = parseInt(send_amount * 100000000);
      var ck = CoinKey.fromWif(wif);
      var privateKey = ck.privateKey.toString("hex");
      var keys = new bitcoin.ECPair(bigi.fromHex(privateKey));
      console.log("keys =" + keys);
      var newtx = {
        inputs: [{ addresses: [selfAddress] }],
        outputs: [{ addresses: [sendAddress.value], value: satoshi_amount }]
      };

      if (net === "MainNet") {
        new_base =
          "https://api.blockcypher.com/v1/ltc/main/txs/new?token=" +
          BLOCK_TOKEN;
        send_base =
          "https://api.blockcypher.com/v1/ltc/main/txs/send?token=" +
          BLOCK_TOKEN;
      } else {
        new_base =
          "https://api.blockcypher.com/v1/ltc/test3/txs/new?token=" +
          BLOCK_TOKEN;
        send_base =
          "https://api.blockcypher.com/v1/ltc/test3/txs/send?token=" +
          BLOCK_TOKEN;
      }

      axios.post(new_base, newtx).then(function(tmptx) {
        console.log("create new transaction= " + JSON.stringify(tmptx));
        var sendtx = {
          tx: tmptx.data.tx
        };
        sendtx.pubkeys = [];
        sendtx.signatures = tmptx.data.tosign.map(function(tosign, n) {
          sendtx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
          return keys
            .sign(new buffer.Buffer(tosign, "hex"))
            .toDER()
            .toString("hex");
        });

        axios.post(send_base, sendtx).then(function(finaltx) {
          console.log("finaltx= " + finaltx);
          dispatch(
            sendEvent(
              true,
              "Transaction complete! Your balance will automatically update when the blockchain has processed it."
            )
          );
          setTimeout(() => dispatch(clearTransactionEvent()), 2000);
          return true;
        });
      });
    }
  }
  // close confirm pane and clear fields
  dispatch(togglePane("confirmPane"));
  sendAddress.value = "";
  sendAmount.value = "";
  confirmButton.blur();
};

const StatusMessage = ({ sendAmount, sendAddress, handleCancel, handleConfirm }) => {
    let message = (
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
              <strong>Confirm sending {sendAmount} LTC to {sendAddress}</strong>
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

class SendLTC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      gas: 0,
      neo: 0,
      neo_usd: 0,
      gas_usd: 0,
      value: 0,
      inputEnabled: true,
      modalStatus: false
    };
    this.handleChangeNeo = this.handleChangeNeo.bind(this);
    this.handleChangeGas = this.handleChangeGas.bind(this);
    this.handleChangeUSD = this.handleChangeUSD.bind(this);

    if (!this.props.ltcLoggedIn) {
      this.props.dispatch(ltcLoginRedirect("/sendLTC"));
      this.props.history.push("/newLitecoin");
    }
  }

  async componentDidMount() {
    let neo = await axios.get(apiURLFor("LTC"));
    let gas = await axios.get(apiURLFor("LTC"));
    neo = neo.data.USD;
    gas = gas.data.USD;
    this.setState({ neo: neo, gas: gas });
  }

  handleChangeNeo(event) {
    this.setState({ value: event.target.value }, (sendAmount = value));
    const value = event.target.value * this.state.neo;
    this.setState({ neo_usd: value });
  }

  handleChangeGas(event) {
    this.setState({ value: event.target.value }, (sendAmount = value));
    const value = event.target.value * this.state.gas;
    this.setState({ gas_usd: value });
  }

  async handleChangeUSD(event) {
    this.setState({ gas_usd: event.target.value });

    let gas = await axios.get(apiURL("LTC"));
    gas = gas.data.USD;
    this.setState({ gas: gas });
    console.log("done");
    const value = this.state.gas_usd / this.state.gas;
    this.setState({ value: value }, (sendAmount = value));
  }

  render() {
    const {
      dispatch,
      wif,
      address,
      ltc_address,
      ltc_wif,
      status,
      neo,
      gas,
      ltc,
      net,
      confirmPane,
      selectedAsset
    } = this.props;
    let confirmPaneClosed;
    let open = true;
    if (confirmPane) {
      confirmPaneClosed = "100%";
      open = true;
    } else {
      open = false;
      confirmPaneClosed = "69%";
    }

    let btnClass;
    let formClass;
    let priceUSD = 0;
    let gasEnabled = false;
    let inputEnabled = true;
    let convertFunction = this.handleChangeNeo;
    if (selectedAsset === "Gas") {
      btnClass = "btn-send";
      convertFunction = this.handleChangeNeo;
      formClass = "form-control-exchange";
      priceUSD = this.state.neo_usd;
      inputEnabled = true;
    } else if (selectedAsset === "Neo") {
      gasEnabled = true;
      inputEnabled = true;
      btnClass = "btn-send";
      formClass = "form-control-exchange";
      priceUSD = this.state.gas_usd;
      convertFunction = this.handleChangeGas;
    }
    return (
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
                          sendTransaction(
                              dispatch,
                              net,
                              ltc_address,
                              ltc_wif,
                              selectedAsset,
                              neo,
                              gas,
                              ltc
                          )
                          this.setState({
                              modalStatus: false
                          })
                      }}
                  />
                  :
                  null
          }
        <div id="send"
        onLoad={() =>
					refreshBalance(
						this.props.dispatch,
						this.props.net,
						this.props.address,
						this.props.btc,
						this.props.ltc,
						this.props.eth
					)
				}
        >
          <div className="row dash-panel">
            <div className="col-xs-5">
              <img
                src={litecoinLogo}
                alt=""
                width="44"
                className="neo-logo flipInY"
              />
              <h2>Litecoin</h2>
              <hr className="dash-hr-wide" />
							<span className="market-price"> {numeral(this.props.marketLTCPrice).format("$0,0.00")} each</span><br />
							<span className="font24">{numeral(
								Math.floor(this.props.ltc * 100000) / 100000
							).format("0,0.00000000")} <span className="eth-price"> LTC</span></span><br />
							<span className="market-price">{numeral(this.props.ltc * this.props.marketLTCPrice).format("$0,0.00")} USD</span>

            </div>

            <div className="col-xs-7 center">
            <LTCChart />
            </div>

            <div className="clearboth" />

            <div className="top-20">
              <div className="col-xs-9">
                <input
                  className="form-send-white "
                  id="center"
                  placeholder="Enter a valid LTC public address here"
                  ref={node => {
                    sendAddress = node;
                  }}
                />
              </div>

              <div className="col-xs-3">
                <LTCQRModalButton />
              </div>

              <div className="col-xs-5  top-20">
                <input
                  className="form-send-white "
                  type="number"
                  id="assetAmount"
                  min="1"
                  onChange={convertFunction}
                  value={this.state.value}
                  placeholder="Enter amount to send"
                  ref={node => {
                    sendAmount = node;
                  }}
                />
                <div className="clearboth" />
                <span className="com-soon block top-10">
                  Amount in LTC to send
                </span>
              </div>
              <div className="col-xs-4 top-20">
                <input
                  className="form-send-white "
                  id="sendAmount"
                  onChange={this.handleChangeUSD}
                  onClick={this.handleChangeUSD}
                  disabled={gasEnabled === false ? true : false}
                  placeholder="Amount in US"
                  value={`${priceUSD}`}
                />
                <label className="amount-dollar">$</label>
                <div className="clearboth" />
                <span className="com-soon block top-10">Calculated in USD</span>
              </div>
              <div className="col-xs-3 top-20">
                <div id="sendAddress">
                  <button
                    className="grey-button"
                    onClick={() => {
                        if (sendAddress.value === '') {
                            dispatch(sendEvent(false, "You can not send without address."));
                            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                            return false;
                        }


                        if (parseFloat(sendAmount.value) <= 0) {
                            dispatch(sendEvent(false, "You cannot send negative amounts of LTC."));
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

              <div className="clearboth" />

              <div className="col-xs-12 com-soon">
                Fees: 0.0001 LTC/KB<br />
              </div>
              <div className="col-xs-12 top-10">
                <TransactionHistoryLTC />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  blockIndex: state.metadata.block_index,
  wif: state.account.wif,
  address: state.account.address,
  ltc_address: state.account.ltcPubAddr,
  ltc_wif: state.account.ltcPrivKey,
  net: state.metadata.network,
  marketLTCPrice: state.wallet.marketLTCPrice,
  selectedAsset: state.transactions.selectedAsset,
  confirmPane: state.dashboard.confirmPane,
  marketLTCPrice: state.wallet.marketLTCPrice,
  ltcLoggedIn: state.account.ltcLoggedIn,
  ltcPrivKey: state.account.ltcPrivKey,
  ltcPubAddr: state.account.ltcPubAddr,
  combined: state.wallet.combined,
  price: state.wallet.price,
  btc: state.account.Btc,
  ltc: state.account.Ltc,
  eth: state.account.Eth,
  wif: state.account.wif,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  btc: state.wallet.Btc,
  ltc: state.wallet.Ltc,
  eth: state.wallet.Eth
});

SendLTC = connect(mapStateToProps)(SendLTC);

export default SendLTC;
