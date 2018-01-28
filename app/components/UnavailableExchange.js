import React from "react";

export default function UnavailableExchange(props)  {
	const {exchangeName} = props;
	return  (
		<div className="dash-panel fadeInDown">
			<div className="com-soon row fadeInDown center">
				<div id="preloader">
					<div id="loader"></div>
				</div>
				<h1 className="top-20">{exchangeName} not available</h1>
				<div className="col-xs-10 col-xs-offset-1">
					<h4 className="top-20 lineheight-up">
            We apologise but our exchange partner {exchangeName} currently does not have NEO available. Please try again soon.
					</h4>
				</div>
				<div className="clear-both" />
			</div>
		</div>
	);
}