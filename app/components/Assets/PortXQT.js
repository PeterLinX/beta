import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import xqtLogo from "../../img/xqt.png";
import NEPQRModal from "./NEPQRModal.js";
class PortXQT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			efxPrice: 0,
		};

	}


	render() {
		return (

			<div>


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendXQT"><img
							src={xqtLogo}
							alt="Quarteria"
							width="44"
							className="port-logos"
						/></Link>
						<hr className="dash-hr" />
						<h3><NEPQRModal />   <Link to="/sendXQT"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
<Link to="/sendXQT">
						<div className="port-price-col">
							<span className="market-price"> Quarteria {numeral(this.props.marketXQTPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.xqt * 100000) / 100000
							).format("0,0.0000")} <span className="ltc-price"> XQT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.xqt*this.props.marketXQTPrice).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	xqt: state.wallet.Xqt,
	marketXQTPrice: state.wallet.marketXQTPrice,
});

PortXQT = connect(mapStateToProps)(PortXQT);
export default PortXQT;
