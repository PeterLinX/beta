import React from "react";
import { clipboard } from "electron";
import ReactTooltip from "react-tooltip";

export default function Complete(props) {
	const { txData  } = props;
	return (
		<div>

			<div className="progress-bar4 fadeInLeft-ex" />
			<div className="row prog-info top-20">
				<div className="col-xs-2 col-xs-offset-1 sm-text center">
					Enter Amount to Deposit
				</div>
				<div className="col-xs-2 sm-text center">Placing Your Order</div>
				<div className="col-xs-2 sm-text center">
					Generating Bitcoin Address for Deposit
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Processing Your Order
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Transaction Complete!
				</div>
			</div>

			<div className="top-50" id="exchange-messages">
				<div className="dash-panel fadeInDown">
					<div className="com-soon row fadeInDown">
						<div className="col-md-12">
							<h1>{"Order Complete!"}</h1>
							<p
								className="trasactionId"
								data-tip
								data-for="copyTransactionIdTip"
								onClick={() =>
									clipboard.writeText(txData.deposit)
								}
							>
								Transaction ID: {txData.transactionUrl}
							</p>
							{/*TODO: Add blockchain.info transaction URL?*/}
						</div>
					</div>
				</div>

				<ReactTooltip
					className="solidTip"
					id="copyTransactionUrlTip"
					place="bottom"
					type="dark"
					effect="solid"
				>
					<span>Copy Transaction URL</span>
				</ReactTooltip>
			</div>
		</div>
	);
}