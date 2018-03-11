import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Modal from "react-bootstrap-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import litecoinLogo from "../img/litecoin.png";
import TransactionHistoryLTC from "./TransactionHistoryLTC";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import { ltcLoginRedirect } from '../modules/account';
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

const apiURL = val => {
	return "https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD";
};

const getUnspentOutputsForLtc = async (net,address) =>{
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
	ltc_balance
) => {
	// validate fields again for good measure (might have changed?)
	if (validateForm(dispatch, asset ,net) === true) {
        //dispatch(sendEvent(true, "Processing..."));

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
            dispatch(sendEvent(false, "Sorry, transaction failed. Please try again in a few minutes."));
						setTimeout(() => dispatch(clearTransactionEvent()), 2000);
						return false;
        } else if (ltc_balance < sendAmount.value) {
            dispatch(sendEvent(false, "Your LTC balance is less than the amount your are sending."));
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
                outputs: [{addresses: [sendAddress.value], value: satoshi_amount}]
			};

            if(net === "MainNet") {
            	new_base = "https://api.blockcypher.com/v1/ltc/main/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/ltc/main/txs/send?token=" + BLOCK_TOKEN;
			} else {
                new_base = "https://api.blockcypher.com/v1/ltc/test3/txs/new?token="+BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/ltc/test3/txs/send?token="+BLOCK_TOKEN;
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
			inputEnabled: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUSD = this.handleChangeUSD.bind(this);

    if(!this.props.ltcLoggedIn){
      this.props.dispatch(ltcLoginRedirect("/sendLTC"));
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
    ltc_address,
    ltc_prvkey,
		status,
		neo,
		gas,
		net,
		confirmPane,
		selectedAsset,
		ltc,
    ltcBlockHeight
    } = this.props;

    return (
      <div>
				<div id="send">

					<div className="row dash-panel">
						<div className="col-xs-8">
							<img
								src={litecoinLogo}
								alt=""
								width="45"
								className="neo-logo fadeInDown"
							/>
							<h2>Send Bitcoin (LTC)</h2>
						</div>

						<div
            className="col-xs-1 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.ltc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh font24" />
          </div>

						<div className="col-xs-3 center">
						<div className="send-panel-price">{numeral(this.props.ltc).format("0,0.0000000")} <span className="ltc-price"> LTC</span></div>

						<span className="market-price">{numeral(this.props.ltc * this.props.marketLTCPrice).format("$0,0.00")} USD</span>
						</div>

						<div className="col-xs-12 center">
							<hr className="dash-hr-wide top-20" />
						</div>

						<div className="clearboth" />

						<div className="top-20">
							<div className="col-xs-9">
								<input
									className="form-control-exchange"
									id="center"
									placeholder="Enter a valid LTC public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">

							<Link to={ "/receiveBitcoin" }>
								<button className="grey-button com-soon" >
									<span className="glyphicon glyphicon-qrcode marg-right-5"/>  Receive
								</button></Link>

							</div>

							<div className="col-xs-5  top-20">
								<input
								className="form-control-exchange"
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
								<span className="com-soon block top-10">Amount in LTC to send</span>
							</div>
							<div className="col-xs-4 top-20">
								<input
								className="form-control-exchange"
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
										className="grey-button"
										onClick={() =>
											sendTransaction(
												dispatch,
												net,
												ltc_address,
                        						ltc_prvkey,
												selectedAsset,
												neo,
												gas,
												this.props.ltc
											)
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
							Fees: 0.0001 LTC/KB<br />
							Block: {this.props.ltcBlockHeight}{" "}

							</div>
							<div className="col-xs-12 top-30">
							<TransactionHistoryLTC />
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
    ltcBlockHeight: state.metadata.ltcBlockHeight,
	blockIndex: state.metadata.block_index,
	wif: state.account.wif,
	address: state.account.address,
	ltc_address: state.account.ltcPubAddr,
	ltc_prvkey: state.account.ltcPrivKey,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	ltc: state.wallet.Ltc,
	marketltcPrice: state.wallet.marketLTCPrice,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	ltcLoggedIn: state.account.ltcLoggedIn,
	ltcPrivKey: state.account.ltcPrivKey,
	ltcPubAddr: state.account.ltcPubAddr,
	combined: state.wallet.combined
});

SendLTC = connect(mapStateToProps)(SendLTC);
export default SendLTC;
