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
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import {BLOCK_TOKEN} from "../core/constants";
import TransactionHistoryLTC from "./TransactionHistoryLTC";
import { syncTransactionHistory ,syncLtcTransactionHistory, block_index} from "../components/NetworkSwitch";
import { ltcLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";

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
        base = "https://live.blockcypher.com/ltc/address/"+address+"/utxo";
    }	else {
        base = "https://live.blockcypher.com/ltc-testnet/address/"+address+"/utxo";
    }

    var response = await axios.get(base);
    console.log(response.data);
    return response.data;
};


// form validators for input fields

// form validators for input fields
const validateForm = (dispatch, asset ,net) => {
    // check for valid address
	if (net == "MainNet") {
		var validMain = WAValidator.validate(sendAddress.value,"litecoin");
		if(validMain) {
			 return true;
		} else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
		}
	} else {
        var validTest = WAValidator.validate(sendAddress.value,"litecoin","testnet");
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
	if (validateForm(dispatch, asset ,net) === true) {
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
				dispatch(sendEvent(true, "Transaction complete! Your balance will automatically update when the blockchain has processed it."));
				setTimeout(() => dispatch(clearTransactionEvent()), 2000);
				return true;

	console.log("wif ="+wif);
				var ck = CoinKey.fromWif(wif);
				var privateKey = ck.privateKey.toString('hex');
	console.log("hex private key = "+privateKey);
				var keys    = new bitcoin.ECPair(bigi.fromHex(privateKey));
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
                    })
                });
		}
	}
	// close confirm pane and clear fields
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
		this.handleChangeNeo = this.handleChangeNeo.bind(this);
		this.handleChangeGas = this.handleChangeGas.bind(this);
		this.handleChangeUSD = this.handleChangeUSD.bind(this);

		if(!this.props.ltcLoggedIn){
			this.props.dispatch(ltcLoginRedirect("/sendLTC"));
			this.props.history.push("/newLitecoin");
		}
	}

	async componentDidMount() {
		let neo = await axios.get(apiURL("NEO"));
		let gas = await axios.get(apiURL("GAS"));
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

		let gas = await axios.get(apiURL("GAS"));
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
			selectedAsset,
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
				<div id="send">

					<div className="row dash-panel">
						<div className="col-xs-8">
							<img
								src={litecoinLogo}
								alt=""
								width="44"
								className="neo-logo fadeInDown"
							/>
							<h2>Send Litecoin (LTC)</h2>
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
									className={formClass}
									id="center"
									placeholder="Enter a valid LTC public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">

							<Link to={ "/receiveLitecoin" }>
								<button className="grey-button com-soon" >
									<span className="glyphicon glyphicon-qrcode marg-right-5"/>  Receive
								</button></Link>

							</div>

							<div className="col-xs-5  top-20">
								<input
									className={formClass}
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
								<div className="clearboth"/>
								<span className="com-soon block top-10">Amount in LTC to send</span>
							</div>
							<div className="col-xs-4 top-20">
								<input
									className={formClass}
									id="sendAmount"
									onChange={this.handleChangeUSD}
									onClick={this.handleChangeUSD}
									disabled={gasEnabled === false ? true : false}
									placeholder="Amount in US"
									value={`${priceUSD}`}
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
												ltc_wif,
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
							Block: {this.props.blockIndex}{" "}

							</div>
							<div className="col-xs-12 top-20">
							<TransactionHistoryLTC />
							</div>
						</div>
					</div>

					<div className="send-notice">
						<div className="col-xs-2"/>
						<div className="col-xs-8">
							<p className="center donations"
								data-tip
								data-for="donateTip"
								onClick={() => clipboard.writeText("LP7vnYjxKQB7dkik38ghMhC724iVJ7Cqir")}
							>Morpheus Dev Team: LP7vnYjxKQB7dkik38ghMhC724iVJ7Cqir</p>
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
	blockHeight: state.metadata.blockHeight,
	wif: state.account.wif,
	address: state.account.address,
	ltc_address:state.account.ltcPubAddr,
  ltc_wif:state.account.ltcPrivKey,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	marketLTCPrice: state.wallet.marketLTCPrice,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	ltc: state.wallet.Ltc,
	marketLTCPrice: state.wallet.marketLTCPrice,
	ltcLoggedIn: state.account.ltcLoggedIn,
	ltcPrivKey: state.account.ltcPrivKey,
	ltcPubAddr: state.account.ltcPubAddr,
});

SendLTC = connect(mapStateToProps)(SendLTC);

export default SendLTC;
