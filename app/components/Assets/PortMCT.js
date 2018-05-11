import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import mctLogo from "../../img/mct.png";

class PortMCT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gdmPrice: 0
		};

	}

	render() {
		return (

			<div>



						<div className="col-3 flipInX">

						<div className="port-logo-col">
						<Link to="/sendMCT">
						<div id="no-inverse">
						<img
							src={mctLogo}
							alt=""
							width="44"
							className="port-logos"
						/>
						</div>
						</Link>

					<h3><NEPQRModal />   <Link to="/sendMCT"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
					<Link to="/sendMCT">
					<div className="port-price-col">
					<span className="market-price">Master Contract {numeral(this.props.marketMCTPrice).format("$0,0.00")}</span>
					<h3>{numeral( Math.floor(this.props.mct * 100000) / 100000).format("0,0[.][0000]")}  <span className="ltc-price"> MCT</span></h3>
					<span className="market-price">{numeral(this.props.mct * this.props.marketMCTPrice).format("$0,0.00")} USD</span>
					</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	mct: state.wallet.Mct,
	marketMCTPrice: state.wallet.marketMCTPrice
});

PortMCT = connect(mapStateToProps)(PortMCT);
export default PortMCT;
