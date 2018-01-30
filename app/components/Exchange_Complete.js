import React from "react";
import { clipboard } from "electron";
import ReactTooltip from "react-tooltip";

export default function Exchange_Complete(props) {
	const { completeData, resetOrderState  } = props;
	return (
		<div>
			<div className="progress-bar4 fadeInLeft-ex" />
			<div className="row prog-info top-20">
				<div className="col-xs-2 col-xs-offset-1 sm-text center">
					Enter Amount to Deposit
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Placing Your Order</div>
				<div className="col-xs-2 sm-text center grey-out">
					Generating Deposit Address
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Processing Your Order
				</div>
				<div className="col-xs-2 sm-text center grey-out">
					Transaction Complete
				</div>
			</div>

			<div className="top-130 dash-panel">
				<div className="top-50" id="exchange-messages">
					<div className="com-soon row fadeInDown">
						<div className="col-md-12">
							<h1>{"Transaction Complete!"}</h1>
							<p
								className="trasactionId"
								data-tip
								data-for="copyTransactionIdTip"
								onClick={() =>
									clipboard.writeText(completeData.transactionURL)
								}
							>
								{/*TODO: Design indicator of being copyable and give feedback when copied*/}
									Transaction URL: {completeData.transactionURL}
							</p>
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

			<div className="col-xs-4 center top-20">
				<button
					onClick={resetOrderState}
					className="btn-send">Place New Order</button>
			</div>

		</div>
	);
}
