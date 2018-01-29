import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import MdSync from "react-icons/lib/md/sync";
import QRCode from "qrcode.react";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import UnavailableExchange from "../components/UnavailableExchange";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import neoLogo from "../img/neo.png";
import NeoLogo from "./Brand/Neo";
import BtcLogo from "./Brand/Bitcoin";

import { Link } from "react-router";
import crypto from "crypto";
import axios from "axios";
import Changelly from "../modules/changelly";
import { error } from "util";

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};

const apiUrl = "https://api.changelly.com";
const apiKey = "1befd82a2ef24c359c3106f96b5217c0";
const secret =
	"eeea2b75ae6a627e69bd39a0de64675a2b0a414b0b9a9513355ba9e30eb6cb2f";

const changelly = new Changelly(apiKey, secret);

export default class Deposit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			address: "",
			from: "btc",
			to: "neo",
			fromValue: 0,
			toValue: 0,
			minAmount: 0,
			transactionId: null,
			status: null,
			message: null,
			statusMessage: null,
			error: false
		};
		// this.handleChange = this.handleChange.bind(this);
		// this.getStatus = this.getStatus.bind(this);
	}

	// async getStatus() {
	// 	setInterval(() => {
	// 		changelly.getStatus(this.state.transactionId, (err, data) => {
	// 			if (err) {
	// 				console.log("Error!", err);
	// 			} else {
	// 				this.setState({ status: data.result });
	// 				if (data.result === "confirming") {
	// 					this.setState({
	// 						message:
	// 							"Your transaction is awaiting confirmation. Please don't quit Morpheus until payment status is received",
	// 						statusMessage: "Confirming"
	// 					});
	// 				} else if (data.result === "waiting") {
	// 					this.setState({
	// 						message:
	// 							"Please do not close window until you receive a confirmation notification. Please copy your transaction ID below for support.",
	// 						statusMessage: "Waiting for Bitcoin Deposit"
	// 					});
	// 				} else if (data.result === "refunded") {
	// 					this.setState({
	// 						message: "Exchange failed and Bitcoin refunded.",
	// 						statusMessage: "Refunded"
	// 					});
	// 				} else if (data.result === "sending") {
	// 					this.setState({
	// 						message: "NEO is being sent to your address in Morpheus.",
	// 						statusMessage: "Success. Sending NEO"
	// 					});
	// 				} else if (data.result === "exchanging") {
	// 					this.setState({
	// 						message:
	// 							"Your payment was received and is being exchanged via our exchange partner Changelly.",
	// 						statusMessage: "Exchanging"
	// 					});
	// 				}
	// 			}
	// 		});
	// 	}, 6000);
	// }

	// handleChange(event) {
	// 	const { fromValue } = this.state;
	// 	this.setState({ fromValue: event.target.value }, () => {
	// 		changelly.getExchangeAmount(
	// 			this.state.from,
	// 			this.state.to,
	// 			this.state.fromValue,
	// 			(err, data) => {
	// 				if (err) {
	// 					console.log("Error!", err);
	// 				} else {
	// 					console.log(data);
	// 					this.setState({ toValue: data.result });
	// 				}
	// 			}
	// 		);
	// 	});
	// }

	render() {
		const { payinAddress } = this.props;
		return (
			<div>

				<div className="progress-bar2 fadeInLeft-ex" />
				<div className="row prog-info top-20">
					<div className="col-xs-2 col-xs-offset-1 sm-text center">
						Enter Amount to Deposit
					</div>
					<div className="col-xs-2 sm-text center">Placing Your Order</div>
					<div className="col-xs-2 sm-text center">
						Generating Bitcoin Address
					</div>
					<div className="col-xs-2 sm-text center grey-out">
						Processing Your Order
					</div>
					<div className="col-xs-2 sm-text center grey-out">
						Transaction Complete!
					</div>
				</div>

				<div className="top-130" id="payIn">
					<div className="dash-panel fadeInDown">
						<div className="com-soon row fadeInDown">
							<div className="col-xs-4">
								<div className="exchange-qr center animated fadeInDown">
									<QRCode size={150} value={payinAddress} />
								</div>
							</div>
							<div className="col-xs-8">
								<div className="exch-logos">
									<BtcLogo width={40} />
								</div>
								<h4 className="top-20">
									Deposit {this.state.fromValue} BTC and receive{" "}
									{Math.floor(this.state.toValue)} NEO
								</h4>
								<input
									className="form-control-exchange center top-10"
									readOnly
									data-tip
									data-for="copypayInAddressTip"
									onClick={() => clipboard.writeText(this.state.payinAddress)}
									placeholder={this.state.payinAddress}
								/>
								<p className="sm-text">
									Only deposit Bitcoin (BTC) to the address above to receive
									NEO.
								</p>
								<div className="row top-10">
									<div className="col-xs-8 center">
										<button
											className="btn-send"
										>
											Process Order
										</button>
									</div>
									<div className="col-xs-4">
										<p className="sm-text">Powered by:</p>
										<div className="changelly-logo-sm" />
									</div>
								</div>

								<ReactTooltip
									className="solidTip"
									id="copypayInAddressTip"
									place="bottom"
									type="dark"
									effect="solid"
								>
									<span>Copy Deposit Address</span>
								</ReactTooltip>
							</div>
							<div className="row top-20" />
							<hr className="dash-hr-wide" />
							<div className="col-xs-12 top-20">
								<p className="sm-text center">
									Only click the Process Order button if you have successfully deposited Bitcoin to the address above. Depositing anything but Bitcoin (BTC) to the address above may result in your funds being lost.
								</p>
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}