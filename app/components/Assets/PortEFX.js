import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import effectLogo from "../../img/effect.png";

class PortEFX extends Component {
	constructor(props) {
		super(props);
		this.state = {
			efxPrice: 0,
		};

	}


	render() {
		return (

			<div>

						<Link to="/sendEFX">
						<div className="col-3 ">
						<div className="port-logo-col">
						<img
							src={effectLogo}
							alt="Effect.ai"
							width="38"
							className="port-logos"
						/>
						<hr className="dash-hr" />
						<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/receive"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>

						<div className="port-price-col">
							<span className="market-price">Effect.ai $0.00</span>
							<h3>{numeral(
	              Math.floor(this.props.efx * 100000) / 100000
	            ).format("0,0.0000")} <span className="ltc-price"> EFX</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
						</div>
						</Link>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	efx: state.wallet.Efx,
	marketEFXPrice: state.wallet.marketEFXPrice,
});

PortEFX = connect(mapStateToProps)(PortEFX);
export default PortEFX;
