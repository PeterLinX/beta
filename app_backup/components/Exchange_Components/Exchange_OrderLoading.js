import React from "react";
import Exchange_ProgressBar from "./Exchange_ProgressBar";

export default function Exchange_OrderLoading(props) {
	const { exchangeName, stage } = props;
	return (
		<div>

			<Exchange_ProgressBar stage={stage} />

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