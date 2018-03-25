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
import btcLogo from "../img/btc-logo.png";
import TransactionHistoryBTC from "./TransactionHistoryBTC";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import { btcLoginRedirect } from '../modules/account';
import {BLOCK_TOKEN} from "../core/constants";
import numeral from "numeral";
import { block_index} from "../components/NetworkSwitch";

var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require('coinkey')

let sendAddress, sendAmount, confirmButton;

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
	return "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
};

const getUnspentOutputsForBtc = async (net,address) =>{
    let base;
    if(net === "MainNet") {
        base = "https://blockexplorer.com/api/addr/"+address+"/utxo";
    }	else {
        base = "https://testnet.blockexplorer.com/api/addr/"+address+"/utxo";
    }

    var response = await axios.get(base);
    console.log(response.data);
    return response.data;
};



// form validators for input fields
const validateForm = (dispatch, asset ,net) => {
    // check for valid address
	if (net == "MainNet") {
		var validMain = WAValidator.validate(sendAddress.value,"bitcoin");
		if(validMain) {
			 return true;
		} else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
		}
	} else {
        var validTest = WAValidator.validate(sendAddress.value,"bitcoin","testnet");
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


function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime()-start) > milliseconds) {
			break;
		}
	}
}


// perform send transaction
const sendTransaction = async (
	dispatch,
	net,
	selfAddress,
	wif,
	asset,
	neo_balance,
	gas_balance,
	btc_balance
) => {
	// validate fields again for good measure (might have changed?)
	if (validateForm(dispatch, asset ,net) === true) {
        //dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress.value,
            asset: asset,
            amount: sendAmount.value
        });
        console.log("Display btc balance\n");
        console.log(btc_balance);
        //Send bitcoin
        let send_amount = parseFloat(sendAmount.value);

        if (btc_balance <= 0) {
            dispatch(sendEvent(false, "Sorry, transaction failed. Please try again in a few minutes."));
						setTimeout(() => dispatch(clearTransactionEvent()), 2000);
						return false;
        } else if (btc_balance < sendAmount.value) {
            dispatch(sendEvent(false, "Your BTC balance is less than the amount your are sending."));
						setTimeout(() => dispatch(clearTransactionEvent()), 2000);
						return false;
        } else {
            let new_base,send_base;
            let satoshi_amount = parseInt(send_amount * 100000000);
            var ck = CoinKey.fromWif(wif);
            var privateKey = ck.privateKey.toString('hex');
            var keys = new bitcoin.ECPair(bigi.fromHex(privateKey));
            console.log("keys ="+keys);
			var newtx = {
                inputs: [{addresses: [selfAddress]}],
                outputs: [{addresses: [sendAddress.value],value: satoshi_amount}]
			};

            if(net === "MainNet") {
            	new_base = "https://api.blockcypher.com/v1/btc/main/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/btc/main/txs/send?token=" + BLOCK_TOKEN;
			} else {
                new_base = "https://api.blockcypher.com/v1/btc/test3/txs/new?token="+BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/btc/test3/txs/send?token="+BLOCK_TOKEN;
			}

			 axios.post(new_base,newtx)
				.then(function (tmptx) {
					console.log("create new transaction= "+JSON.stringify(tmptx));
					var sendtx = {
						tx: tmptx.data.tx
					}
                    sendtx.pubkeys = [];
                    sendtx.signatures = tmptx.data.tosign.map(function(tosign, n) {
                        sendtx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                        return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");

                	});

                     axios.post(send_base, sendtx).then(function(finaltx) {
                        console.log("finaltx= "+ finaltx);
                         dispatch(sendEvent(true, "Transaction complete! Your balance will automatically update when the blockchain has processed it."));
                         setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                         return true;
                    })
                });
        }
    }

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
					<strong>Confirm sending {sendAmount} BTC to {sendAddress}</strong>
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

class SendBTC extends Component {
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
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUSD = this.handleChangeUSD.bind(this);

    if(!this.props.btcLoggedIn){
      this.props.dispatch(btcLoginRedirect("/sendBTC"));
      this.props.history.push("/newBitcoin");
    }
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
    btc_address,
    btc_prvkey,
		status,
		neo,
		gas,
		net,
		confirmPane,
		selectedAsset,
		btc,

    } = this.props;

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
                              btc_address,
                              btc_prvkey,
                              selectedAsset,
                              neo,
                              gas,
                              btc
                              )
                          this.setState({
                              modalStatus: false
                          })
                      }}
				  />
                  :
                  null
          }
				<div id="send">

					<div className="row dash-panel">
						<div className="col-xs-8">
							<img
								src={btcLogo}
								alt=""
								width="45"
								className="neo-logo fadeInDown"
							/>
							<h2>Send Bitcoin (BTC)</h2>
						</div>

						<div
            className="col-xs-1 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.btc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh font24" />
          </div>

						<div className="col-xs-3 center">
						<div className="send-panel-price">{numeral(this.props.btc).format("0,0.0000000")} <span className="btc-price"> BTC</span></div>

						<span className="market-price">{numeral(this.props.btc * this.props.marketBTCPrice).format("$0,0.00")} USD</span>
						</div>

						<div className="col-xs-12 center">
							<hr className="dash-hr-wide top-20" />
						</div>

						<div className="clearboth" />

						<div className="top-20">
							<div className="col-xs-9">
								<input
									className="form-send-btc"
									id="center"
									placeholder="Enter a valid BTC public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">

							<Link to={ "/receiveBitcoin" }>
								<button className="btc-button com-soon" >
									<span className="glyphicon glyphicon-qrcode marg-right-5"/>  Receive
								</button></Link>

							</div>

							<div className="col-xs-5  top-20">
								<input
								className="form-send-btc"
								type="number"
								id="assetAmount"
								min="0.00001"
								onChange={this.handleChange}
								value={this.state.value}
								placeholder="Enter amount to send"
								ref={node => {
									sendAmount = node;
								}}
								/>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Amount in BTC to send</span>
							</div>
							<div className="col-xs-4 top-20">
								<input
								className="form-send-btc"
								id="sendAmount"
                min="0.00001"
								onChange={this.handleChangeUSD}
								placeholder="Amount in US"
								value={`${this.state.fiatVal}`}
								/>
								<label className="amount-dollar">$</label>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Calculated in USD</span>
							</div>
							<div className="col-xs-3 top-20">
								<div id="sendAddress">
									<button
										className="btc-button"
										onClick={() => {
                                            if (sendAddress.value === '') {
                                                dispatch(sendEvent(false, "You can not send without address."));
                                                setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                                return false;
                                            }


                                            if (parseFloat(sendAmount.value) <= 0) {
                                                dispatch(sendEvent(false, "You cannot send negative amounts of BTC."));
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
										<span className="glyphicon glyphicon-send marg-right-5"/>  Send
									</button>
								</div>
							</div>

              <div className="clearboth"/>

							<div className="col-xs-12 com-soon">
							Fees: 0.0001 BTC/KB<br />
							Block: {this.state.block_index}{" "}

							</div>
							<div className="col-xs-12 top-30">
							<TransactionHistoryBTC />
							</div>
						</div>
					</div>

					<div className="send-notice">
						<div className="col-xs-2"/>
						<div className="col-xs-8 center">
							<p className="center donations"
								data-tip
								data-for="donateTip"
								onClick={() => clipboard.writeText("17mE9Y7ERqpn6oUn5TEteNrnEmmXUsQw76")}
							>Morpheus Dev Team: 17mE9Y7ERqpn6oUn5TEteNrnEmmXUsQw76</p>
							<ReactTooltip
								className="solidTip"
								id="donateTip"
								place="top"
								type="light"
								effect="solid"
							>
								<span>Copy address to send donation</span>
							</ReactTooltip>
						</div>

					</div>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
  btcBlockHeight: state.metadata.btcBlockHeight,
	blockIndex: state.metadata.block_index,
	wif: state.account.wif,
	address: state.account.address,
	btc_address: state.account.btcPubAddr,
	btc_prvkey: state.account.btcPrivKey,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	btc: state.wallet.Btc,
	marketBTCPrice: state.wallet.marketBTCPrice,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	combined: state.wallet.combined
});

SendBTC = connect(mapStateToProps)(SendBTC);
export default SendBTC;
