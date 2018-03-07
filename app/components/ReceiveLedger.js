import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import axios from "axios";
import Modal from "react-bootstrap-modal";
import QRCode from "qrcode.react";
import { clipboard, shell } from "electron";
import SplitPane from "react-split-pane";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import CountUp, { startAnimation } from "react-countup";
import neoLogo from "../img/neo.png";
import { doSendAsset, verifyAddress, getTransactionHistory } from "neon-js";
import Neon, { wallet, api } from "@cityofzion/neon-js";
import {
	initiateGetBalance,
	intervals,
	syncTransactionHistory
} from "../components/NetworkSwitch";
import {
	resetPrice,
	setMarketPrice,
	setCombinedBalance
} from "../modules/wallet";
import { log } from "../util/Logs";
import ClaimLedgerGas from "./ClaimLedgerGas.js";
import Dashlogo from "../components/Brand/Dashlogo";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import commNode from "../modules/ledger/ledger-comm-node";

const BIP44_PATH =
  "8000002C" + "80000378" + "80000000" + "00000000" + "00000000";

let sendAddress, sendAmount, confirmButton;

const apiURL = val => {
	return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};

// form validators for input fields
const validateForm = (dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) => {
	// check for valid address
	try {
		if (
			verifyAddress(sendAddress.value) !== true ||
      sendAddress.value.charAt(0) !== "A"
		) {
			dispatch(sendEvent(false, "The address you entered was not valid."));
			setTimeout(() => dispatch(clearTransactionEvent()), 1500);
			return false;
		}
	} catch (e) {
		dispatch(sendEvent(false, "The address you entered was not valid."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1500);
		return false;
	}
	// check for fractional neo
	if (
		asset === "Neo" &&
    parseFloat(sendAmount.value) !== parseInt(sendAmount.value)
	) {
		dispatch(sendEvent(false, "You cannot send fractional amounts of Neo."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1500);
		return false;
	} else if (asset === "Neo" && parseInt(sendAmount.value) > ledgerBalanceNeo) {
		// check for value greater than account balance
		dispatch(sendEvent(false, "You do not have enough NEO to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1500);
		return false;
	} else if (
		asset === "Gas" &&
    parseFloat(sendAmount.value) > ledgerBalanceGAS
	) {
		dispatch(sendEvent(false, "You do not have enough GAS to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1500);
		return false;
	} else if (parseFloat(sendAmount.value) < 0) {
		// check for negative asset
		dispatch(sendEvent(false, "You cannot send negative amounts of an asset."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1500);
		return false;
	}
	return true;
};

// open confirm pane and validate fields
const openAndValidate = (
	dispatch,
	ledgerBalanceNeo,
	ledgerBalanceGAS,
	asset
) => {
	if (
		validateForm(dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) === true
	) {
		dispatch(togglePane("confirmPane"));
	}
};

// perform send transaction
const sendTransaction = (
	dispatch,
	net,
	LedgerAddress,
	wif,
	asset,
	ledgerBalanceNeo,
	ledgerBalanceGAS
) => {
	// validate fields again for good measure (might have changed?)
	if (
		validateForm(dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) === true
	) {
		dispatch(sendEvent(true, "Processing..."));
		log(net, "SEND", LedgerAddress, {
			to: sendAddress.value,
			asset: asset,
			amount: sendAmount.value
		});
		doSendAsset(net, sendAddress.value, wif, asset, sendAmount.value)
			.then(response => {
				if (response.result === undefined || response.result === false) {
					dispatch(sendEvent(false, "Transaction failed!"));
				} else {
					dispatch(
						sendEvent(
							true,
							"Transaction complete! Your balance will automatically update when the blockchain has processed it."
						)
					);
				}
				setTimeout(() => dispatch(clearTransactionEvent()), 1000);
			})
			.catch(e => {
				dispatch(sendEvent(false, "Transaction failed!"));
				setTimeout(() => dispatch(clearTransactionEvent()), 1000);
			});
	}
	// close confirm pane and clear fields
	dispatch(togglePane("confirmPane"));
	sendAddress.value = "";
	sendAmount.value = "";
	confirmButton.blur();
};

const getExplorerLink = (net, explorer, txid) => {
	let base;
	if (explorer === "Neotracker") {
		if (net === "MainNet") {
			base = "https://neotracker.io/tx/";
		} else {
			base = "https://testnet.neotracker.io/tx/";
		}
	} else {
		if (net === "MainNet") {
			base = "http://antcha.in/tx/hash/";
		} else {
			base = "http://testnet.antcha.in/tx/hash/";
		}
	}
	return base + txid;
};

// helper to open an external web link
const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};


const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class Receive extends Component {
	render() {
		console.log(this.props.net);
		return (
			<div id="" className="">
				<Assets />
				<div className="dash-chart-panel">
					<div className="">
						<div className="col-xs-6">
							<img
								src={neoLogo}
								alt=""
								width="38"
								className="neo-logo logobounce"
							/>
							<h2>Receive Neo or Gas</h2>
						</div>
						<div className="col-xs-3" />
						<div className="col-xs-3 top-20 center com-soon">
        Block: {this.props.blockHeight}
						</div>
						<hr className="dash-hr-wide" />
						<div className="clearboth" />
						<div className="col-xs-4 top-20">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.address)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.address} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="light"
									effect="solid"
								>
									<span>Click to copy your NEO Address</span>
								</ReactTooltip>
							</div>
						</div>

						<div className="col-xs-8">
							<h5>Your Public Address</h5>
							<input
								className="ledger-address top-10"
								onClick={() => clipboard.writeText(this.props.address)}
								id="center"
								placeholder={this.props.address}
								value={this.props.address}
							/>
							<div className="clearboth" />
							<div className="dash-bar top-30">
								<div
									className="dash-icon-bar"
									onClick={() => clipboard.writeText(this.props.address)}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-duplicate" />
									</div>
                Copy Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() => print()}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-print" />
									</div>
                Print Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() =>
										openExplorer(getLink(this.props.net, this.props.address))
									}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-link" />
									</div>
                View On Blockchain
								</div>

								<div
									className="dash-icon-bar"
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-save" />
									</div>
                Download Encrypted Key
								</div>


							</div>



						</div>
					</div>
					<div className="clearboth" />
				</div>
				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
          Your NEO address above can be used to receive all NEP5 tokens. All NEO and GAS transactions are FREE. Only send NEO, GAS or NEP tokens to a NEO address. Sending funds other than NEO, GAS or NEP tokens to the address above may result in those funds being lost.
					</p>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	ledgerNanoSGetInfoAsync: state.account.ledgerNanoSGetInfoAsync,
	address: state.account.ledgerAddress,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	combined: state.wallet.combined,
	explorer: state.metadata.blockExplorer,
	blockHeight: state.metadata.blockHeight,
	transactions: state.wallet.transactions,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice
});

Receive = connect(mapStateToProps)(Receive);
export default Receive;
