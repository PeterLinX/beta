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

	render() {
		const { txData } = this.props;
		const { pair, depositAmount, withdrawalAmount } = txData;
		const splitUpperCaseSymbolsArr = pair.toUpperCase().split("_");
		const inputAsset = splitUpperCaseSymbolsArr[0];
		const outputAsset = splitUpperCaseSymbolsArr[1];
		return (
			<div>

				<div className="progress-bar2 fadeInLeft-ex" />
				<div className="row prog-info top-20">
					<div className="col-xs-2 col-xs-offset-1 sm-text center">
						Enter Amount to Deposit
					</div>
					<div className="col-xs-2 sm-text center">Placing Your Order</div>
					<div className="col-xs-2 sm-text center">
						Generating {outputAsset} Address
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
									<QRCode size={150} value={txData.deposit} />
								</div>
							</div>
							<div className="col-xs-8">
								<div className="exch-logos">
									<BtcLogo width={40} />
								</div>
								<h4 className="top-20">
									Deposit {depositAmount} {inputAsset} and receive {withdrawalAmount} {outputAsset}
								</h4>
								<input
									className="form-control-exchange center top-10"
									readOnly
									data-tip
									data-for="copypayInAddressTip"
									onClick={() => clipboard.writeText(txData.deposit)}
									placeholder={txData.deposit}
								/>
								<p className="sm-text">
									Only deposit {inputAsset} to the address above to receive {outputAsset}.
								</p>
								<div className="row top-10">
									{/*TODO: Create a loading indicator and/or loading bar expressing waiting for a deposit confirmation*/}
									<div className="col-xs-8 center">
										<input
											className="form-control-exchange center"
											readOnly
											data-tip
											placeholder={"Waiting for a deposit..."}
										/>
									</div>
									{/*TODO: Dynamically render exchange logo based on passed in exchange in props*/}
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
									Only click the Process Order button if you have successfully deposited {outputAsset} to the address above. Depositing anything but {outputAsset} to the address above may result in your funds being lost.
								</p>
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}