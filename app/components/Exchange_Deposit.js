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

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};


export default class Exchange_Deposit extends Component {

	render() {
		const { txData, exchangeName } = this.props;
		const { pair, deposit, depositAmount, withdrawalAmount } = txData;
		const splitUpperCaseSymbolsArr = pair.toUpperCase().split("_");
		const inputAsset = splitUpperCaseSymbolsArr[0];
		const outputAsset = splitUpperCaseSymbolsArr[1];
		return (
			<div>
				<div className="progress-bar3 fadeInLeft-ex" />
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
									<QRCode size={150} value={deposit} />
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
									onClick={() => clipboard.writeText(deposit)}
									placeholder={deposit}
								/>
								<p className="sm-text">
									Only deposit {inputAsset} to the address above to receive {outputAsset}.
								</p>
								<div className="row top-10">
									{/*TODO: Create a loading indicator and/or loading bar expressing waiting for a deposit confirmation*/}
									<div className="col-xs-8 center">
										<div id="preloader">
											<div id="loader"></div>
										</div>
									</div>
									{/*TODO: Dynamically render exchange logo based on passed in exchange in props*/}
									<div className="col-xs-4">
										<p className="sm-text">Powered by:</p>
										<div className={`${exchangeName}-logo-sm`} />
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
									Depositing anything but {inputAsset} to the address above may result in your funds being lost.
								</p>
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}