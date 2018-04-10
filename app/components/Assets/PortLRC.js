import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import lrcLogo from "../../img/lrc.png";


class PortLRC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lrcPrice: 0
		};

	}

	render() {
		return (

			<div>


							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={lrcLogo}
								alt=""
								width="40"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
							</div>
							<Link to="/loopring">
							<div className="port-price-col">
								<span className="market-price">Loopring (NEP) {numeral(this.props.marketLRNPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.lrn * 100000) / 100000
								).format("0,0.0000")} <span className="eth-price"> LRN</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	lrc: state.wallet.Lrn,
	marketLRNPrice: state.wallet.marketLRNPrice
});

PortLRC = connect(mapStateToProps)(PortLRC);
export default PortLRC;
