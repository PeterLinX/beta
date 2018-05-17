import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";
import { shell, clipboard } from "electron";

import avaLogo from "../../img/ava.png";
import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class AVAListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div
			onClick={() =>
			openExplorer("https://project.travala.com")
			}
			>
				<div className="col-3 center">
				<div>
				<img
					src={avaLogo}
					alt=""
					height="72"
					className="port-logos pointer flipInY"
				/>
				</div>
				<div className="clearboth" />
				<div className="row top-20" />
				<h3>Traval (AVA) Airdrop</h3>
				Formerly Concierge (CGE) Token<br />
				<div className="clearboth" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

AVAListing = connect(mapStateToProps)(AVAListing);
export default AVAListing;
