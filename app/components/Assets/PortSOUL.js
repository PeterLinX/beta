import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import soulLogo from "../../img/sumo.png";
import NEPQRModal from "./NEPQRModal.js";

class PortSOUL extends Component {
	constructor(props) {
		super(props);
		this.state = {
			soulPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">
							<div className="port-logo-col">
							<Link to="/sendSOUL"><img
								src={soulLogo}
								alt=""
								width="38"
								className="port-logos top-10"
							/></Link>

							<h3><NEPQRModal />   <Link to="/sendSOUL"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendSOUL">
							<div className="port-price-col">
								<span className="market-price">Phantasma {numeral(this.props.marketSOULPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.soul * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="dbc-price"> SOUL</span></h3>

								<span className="market-price">{numeral(this.props.soul*this.props.marketSOULPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	soul: state.wallet.Soul,
	marketSOULPrice: state.wallet.marketSOULPrice,
});

PortSOUL = connect(mapStateToProps)(PortSOUL);
export default PortSOUL;
