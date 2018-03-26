import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import tncLogo from "../../img/tnc.png";

class PortTNC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tncPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tncLogo}
								alt=""
								width="50"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/SendTNC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/SendTNC">
							<div className="port-price-col">
								<span className="market-price">Trinity {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="hp-price"> TNC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.tnc*this.props.marketTNCPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	tnc: state.wallet.Tnc,
	marketTNCPrice: state.wallet.marketTNCPrice
});

PortTNC = connect(mapStateToProps)(PortTNC);
export default PortTNC;
