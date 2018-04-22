import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import gagaLogo from "../../img/gaga.png";

class PortGAGA extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gagaPrice: 0
		};

	}


	render() {
		return (

			<div>


								<div className="col-3 flipInX">

								<div className="port-logo-col">
								<Link><img
									src={gagaLogo}
									alt=""
									width="40"
									className="port-logos"
								/></Link>
								<hr className="dash-hr" />
								<h3><NEPQRModal />   <Link><span className=" glyphicon glyphicon-send "/></Link></h3>
								</div>
								<Link>
								<div className="port-price-col">
									<span className="market-price">Gagapay Network {numeral(this.props.marketGAGAPrice).format("$0,0.00")}</span>
									<h3>{numeral(
			              Math.floor(this.props.gaga * 100000) / 100000
			            ).format("0,0.0000")}  <span className="gas-price"> GAGA</span></h3>
									<hr className="dash-hr" />
									<span className="market-price">{numeral((this.props.gaga/10000000000) * this.props.marketGAGAPrice).format("$0,0.00")} USD</span>
								</div></Link>
								</div>



			</div>
		);
	}
}

const mapStateToProps = state => ({
	gaga: state.wallet.Gaga,
	marketGAGAPrice: state.wallet.marketGAGAPrice
});

PortGAGA = connect(mapStateToProps)(PortGAGA);
export default PortGAGA;
