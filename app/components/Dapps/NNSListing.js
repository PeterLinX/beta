import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import nnsLogo from "../../img/nns.png";
import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";


class NNSListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div>
				<div className="col-3 center">

				<img
					src={nnsLogo}
					alt=""
					height="72"
					className="port-logos pointer flipInY"
				/>

				<div className="clearboth" />
				<div className="row top-20" />
				<h3>Coming Soon</h3>
				Start Date: TBA<br />
				<div className="clearboth" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

NNSListing = connect(mapStateToProps)(NNSListing);
export default NNSListing;
