import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";


class DappListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div>
				<div className="col-3">
						<div className="port-logo-col">
							Logo
						</div>
						<div className="port-price-col">
						<strong>Name</strong><br />
						Description:<br />
						Start Date:<br />
						</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

DappListing = connect(mapStateToProps)(DappListing);
export default DappListing;
