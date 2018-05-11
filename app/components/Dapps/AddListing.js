import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import mpxLogo from "../../img/logo.png";
import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";


class GDMListing extends Component {
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
					src={mpxLogo}
					alt=""
					height="72"
					className="port-logos pointer flipInY"
				/>
				<div className="clearboth" />
				<div className="row top-20" />
				<h3>List NEP5 Token Sale</h3>
				Host your token sale in Morpheus<br />
				<div className="clearboth" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

GDMListing = connect(mapStateToProps)(GDMListing);
export default GDMListing;
