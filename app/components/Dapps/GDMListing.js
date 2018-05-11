import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import gdmLogo from "../../img/gdm.png";
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
				<div id="no-inverse">
				<img
					src={gdmLogo}
					alt=""
					height="72"
					className="port-logos pointer flipInY"
				/>
				</div>
				<div className="clearboth" />
				<div className="row top-20" />
				<h3>Whitelist Sale Open</h3>
				Start Date: May 3rd, 2018<br />
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
