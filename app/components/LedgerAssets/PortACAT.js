import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import acatLogo from "../../img/acat.png";

class portACAT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			acatPrice: 0,
		};

	}

	render() {
		return (

			<div>

				<div className="col-3 ">

				<div className="port-logo-col">
				<img
					src={acatLogo}
					alt="Alpha Cat"
					width="66"
					className="port-logos"
				/>
				<hr className="dash-hr" />
				<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
				</div>

				<div className="port-price-col">
					<span className="market-price">Alpha Cat $0.00</span>
					<h3>{numeral(
						Math.floor(this.props.acat * 100000) / 100000
					).format("0,0.0000")} <span className="ltc-price"> ACAT</span></h3>
					<hr className="dash-hr" />
					<span className="market-price">$0.00 USD</span>
				</div>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	acat: state.wallet.Acat,
	net: state.metadata.network,
	marketACATPrice: state.wallet.marketACATPrice,
});

portACAT = connect(mapStateToProps)(portACAT);
export default portACAT;
