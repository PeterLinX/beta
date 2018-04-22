import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import lrnLogo from "../../img/lrn.png";
import NEPQRModal from "./NEPQRModal.js";

class PortLRN extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lrcPrice: 0
		};

	}

	render() {
		return (

			<div>


							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendLRN"><img
								src={lrnLogo}
								alt=""
								width="40"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal /> <Link to="/sendLRN"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendLRN">
							<div className="port-price-col">
								<span className="market-price">Loopring (NEP) {numeral(this.props.marketLRNPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.lrn * 100000) / 100000
								).format("0,0.0000")} <span className="eth-price"> LRN</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.lrn*this.props.marketLRNPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	lrn: state.wallet.Lrn,
	marketLRNPrice: state.wallet.marketLRNPrice
});

PortLRN = connect(mapStateToProps)(PortLRN);
export default PortLRN;
