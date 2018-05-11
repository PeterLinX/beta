import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import effectLogo from "../../img/effect.png";
import NEPQRModal from "./NEPQRModal.js";
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


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendEFX"><img
							src={effectLogo}
							alt="Effect.ai"
							width="38"
							className="port-logos"
						/></Link>

						<h3><NEPQRModal />   <Link to="/sendEFX"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
<Link to="/sendEFX">
						<div className="port-price-col">
							<span className="market-price">Effect.ai {numeral(this.props.marketEFXPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.efx * 100000) / 100000
							).format("0,0[.][0000]")} <span className="ltc-price"> EFX</span></h3>

							<span className="market-price">{numeral(this.props.efx*this.props.marketEFXPrice).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


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
