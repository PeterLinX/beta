import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import pckLogo from "../../img/pck.png";

class PortPKC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pkcPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendPCK"><img
								src={pckLogo}
								alt=""
								width="54"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendPCK"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendPKC">
							<div className="port-price-col">
								<span className="market-price">Pikcio {numeral(this.props.marketPKCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.pkc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> PKC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.pkc*this.props.marketPKCPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	pkc: state.wallet.Pkc,
	marketPKCPrice: state.wallet.marketPKCPrice
});

PortPKC = connect(mapStateToProps)(PortPKC);
export default PortPKC;
