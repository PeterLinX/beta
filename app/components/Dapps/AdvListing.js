import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import neowLogo from "../../img/neow.png";
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
					src={neowLogo}
					alt=""
					height="72"
					className="port-logos pointer flipInY"
				/>
				<div className="clearboth" />
				<div className="row top-20" />
				<h3>Advanced Token Sale</h3>
				Manually enter a script hash.<br />
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
