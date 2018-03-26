import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import deepLogo from "../../img/deep.png";


class PortDBC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbcPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">
							<div className="port-logo-col">
							<img
								src={deepLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>  <span className=" glyphicon glyphicon-send "/></h3>
							</div>
							<div className="port-price-col">
								<span className="market-price">Deep Brain {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.dbc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.dbc*this.props.marketDBCPrice).format("$0,0.00")} USD</span>
							</div>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	dbc: state.wallet.Dbc,
	marketDBCPrice: state.wallet.marketDBCPrice,
});

PortDBC = connect(mapStateToProps)(PortDBC);
export default PortDBC;
