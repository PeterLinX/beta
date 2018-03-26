import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import gasLogo from "../../img/gas.png";

class PortGAS extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0
		};

	}


	render() {
		return (

			<div>

							<Link to="/send">
						<div className="col-3">
						<div className="port-logo-col">
						<img
							src={gasLogo}
							alt=""
							width="36"
							className="port-logos"
						/>
						<hr className="dash-hr" />
						<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/send"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
						<div className="port-price-col">
							<span className="market-price">GAS {numeral(this.props.marketGASPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.gas * 100000) / 100000
							).format("0,0.0000")} <span className="gas-price"> GAS</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{" "}
								{numeral(Math.round(this.props.gasPrice * 100) / 100).format(
									"$0,0.00"
								)}{" "} USD</span>
						</div>
					</div>
					</Link>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice
});

PortGAS = connect(mapStateToProps)(PortGAS);
export default PortGAS;
