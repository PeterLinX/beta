import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import edsLogo from "../../img/eds.png";
import NEPQRModal from "./NEPQRModal.js";

class PortEDS extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edsPrice: 0,
		};

	}


	render() {
		return (

			<div>


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendEDS"><img
							src={edsLogo}
							alt="Endorsit Shares"
							width="36"
							className="port-logos"
						/></Link>
						<hr className="dash-hr" />
						<h3><NEPQRModal />   <Link to="/sendEDS"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
<Link to="/sendEDS">
						<div className="port-price-col">
							<span className="market-price">Endorsit Shares {numeral(this.props.marketEDSPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.eds * 100000) / 100000
							).format("0,0.0000")} <span className="ltc-price"> EDS</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.eds*this.props.marketEDSPrice).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	eds: state.wallet.Eds,
	marketEDSPrice: state.wallet.marketEDSPrice,
});

PortEDS = connect(mapStateToProps)(PortEDS);
export default PortEDS;
