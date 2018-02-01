import React from "react";

export default function Exchange_OrderLoading(props) {
	const { exchangeName  } = props;
	return (
		<div>
			<div className="progress-bar2 fadeInLeft-ex" />
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
					Transaction Complete!
				</div>
			</div>

			<div className="top-130 dash-panel">
				<h2 className="center">Placing Your Order on {exchangeName} </h2>
				<hr className="dash-hr-wide" />
				<div className="row top-10">
					<div id="preloader">
						<div id="loader"></div>
					</div>
				</div>
			</div>

		</div>
	);
}