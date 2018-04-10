import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import nexLogo from "../../img/nex.png";

class PortNEX extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nexPrice: 0
		};

	}


	render() {
		return (

			<div>

						<div className="col-3 ">
						<div className="port-logo-col">
						<img
							src={nexLogo}
							alt=""
							width="44"
							className="port-logos top-10"
						/>
						<hr className="dash-hr" />
						<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
						</div>

						<div className="port-price-col">
							<span className="market-price">Neon Exchange $0.00</span>
							<h3>{numeral(
	              Math.floor(this.props.nex * 100000) / 100000
	            ).format("0,0.0000")} <span className="nex-price"> NEX</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
						</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	nex: state.wallet.Nex,
	marketNEXPrice: state.wallet.marketNEXPrice
});

PortNEX = connect(mapStateToProps)(PortNEX);
export default PortNEX;
