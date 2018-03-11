import React from "react";

export default function Exchange_ProgressBar(props) {
	const { stage } = props;
	let progressBarNum;

	if (!stage) progressBarNum = 1;
	else if (stage === "ordering") progressBarNum = 2;
	else if (stage === "depositing") progressBarNum = 3;
	else if (stage === "processing") progressBarNum = 4;
	else if (stage === "complete") progressBarNum = 5;
	return (
		<div>
			<div className={`progress-bar${progressBarNum} fadeInLeft-ex`} />
			<div className="row prog-info">
				<div className="col-xs-2 col-xs-offset-1 sm-text center ">
					Enter Amount to Deposit
				</div>
				<div className="col-xs-2 sm-text center ">
					Placing Your Order</div>
				<div className="col-xs-2 sm-text center ">
					Generating Deposit Address
				</div>
				<div className="col-xs-2 sm-text center ">
					Processing Your Order
				</div>
				<div className="col-xs-2 sm-text center ">
					Transaction Complete
				</div>
			</div>
		</div>
	);
}
