import React from "react";
import { clipboard } from "electron";
import ReactTooltip from "react-tooltip";
import Exchange_ProgressBar from "./Exchange_ProgressBar";

export default function Exchange_Processing(props) {
	const { txData, stage } = props;
	return (
		<div>

			<Exchange_ProgressBar stage={this.props.stage} />

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