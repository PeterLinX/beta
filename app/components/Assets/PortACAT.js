import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

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
				<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendACAT"><span className=" glyphicon glyphicon-send "/></Link></h3>
				</div>
				<Link to="/sendACAT">
				<div className="port-price-col">
					<span className="market-price">Alpha Cat {numeral(this.props.marketACATPrice).format("$0,0.000")}</span>
					<h3>{numeral(
						Math.floor(this.props.acat * 100000) / 100000
					).format("0,0.0000")} <span className="ltc-price"> ACAT</span></h3>
					<hr className="dash-hr" />
					<span className="market-price">{numeral(this.props.acat * this.props.marketACATPrice).format("$0,0.00")} USD</span>
				</div>
				</Link>
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
