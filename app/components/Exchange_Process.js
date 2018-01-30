import React from "react";
import { clipboard } from "electron";
import ReactTooltip from "react-tooltip";

export default function Exchange_Process(props) {
	const { txData  } = props;
	return (
		<div>

			<div className="progress-bar3 fadeInLeft-ex" />
			<div className="row prog-info top-20">
				<div className="col-xs-2 col-xs-offset-1 sm-text center">
					Enter Amount to Deposit
				</div>
				<div className="col-xs-2 sm-text center">Placing Your Order</div>
				{/*TODO: Specify asset name for deposit address*/}
				<div className="col-xs-2 sm-text center">
					Generating Address for Deposit
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Processing Your Order
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Transaction Complete!
				</div>
			</div>

			<div className="top-130 dash-panel">
				<div className="top-50" id="exchange-messages">
					<div className="com-soon row fadeInDown">
						<div className="col-md-12">
							<h1>{"Deposit Received"}</h1>
							<p>{"Processing transaction..."}</p>
							<p
								className="trasactionId"
								data-tip
								data-for="copyTransactionIdTip"
								onClick={() =>
									clipboard.writeText(txData.deposit)
								}
							>
								Transaction ID: {txData.deposit}
							</p>
							{/*TODO: Add blockchain.info transaction URL?*/}
							{/*TODO: Render # of confirmations?*/}
						</div>
					</div>

					<ReactTooltip
						className="solidTip"
						id="copyTransactionIdTip"
						place="bottom"
						type="dark"
						effect="solid"
					>
						<span>Copy Transaction ID</span>
					</ReactTooltip>
				</div>
			</div>


		</div>
	);
}