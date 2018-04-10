import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import apexLogo from "../../img/apex.png";

class PropApex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apexPrice: 0,
		};

	}

	render() {
		return (

			<div>


				<div className="col-3 ">
				<div className="port-logo-col">
				<img
					src={apexLogo}
					alt="Apex"
					width="48"
					className="port-logos"
				/>
				<hr className="dash-hr" />
				<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className="glyphicon glyphicon-send"/></h3>
				</div>

				<div className="port-price-col">
					<span className="market-price">Apex $0.00</span>
					<h3>{numeral(
						Math.floor(this.props.cpx * 100000) / 100000
					).format("0,0.0000")} <span className="ltc-price"> APEX</span></h3>
					<hr className="dash-hr" />
					<span className="market-price">$0.00 USD</span>
				</div>
				</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	cpx: state.wallet.Cpx,
	net: state.metadata.network,
	marketCPXPrice: state.wallet.marketCPXPrice
});

PropApex = connect(mapStateToProps)(PropApex);
export default PropApex;
