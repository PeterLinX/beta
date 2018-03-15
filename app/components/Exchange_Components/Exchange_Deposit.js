import React, { Component } from "react";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import ReactTooltip from "react-tooltip";
import Exchange_ProgressBar from "./Exchange_ProgressBar";

export default class Exchange_Deposit extends Component {

	render() {
		const { txData, exchangeName, stage } = this.props;
		const { pair, deposit, depositAmount, withdrawalAmount } = txData;
		const splitUpperCaseSymbolsArr = pair.toUpperCase().split("_");
		const inputAsset = splitUpperCaseSymbolsArr[0];
		const outputAsset = splitUpperCaseSymbolsArr[1];
		return (
			<div>

				<Exchange_ProgressBar stage={stage} />

				<div className="top-130" id="payIn">
					<div className="dash-panel fadeInDown">
						<div className="com-soon row fadeInDown">
							<div className="col-xs-4">
								<div className="exchange-qr center animated fadeInDown">
									<QRCode size={150} value={deposit} />
								</div>
							</div>
							<div className="col-xs-8">
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
