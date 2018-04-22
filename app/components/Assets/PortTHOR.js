import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import thorLogo from "../../img/thor.png";

class PortTHOR extends Component {
	constructor(props) {
		super(props);
		this.state = {
			thorPrice: 0
		};

	}


	render() {
		return (

			<div>


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendTHOR"><img
							src={thorLogo}
							alt=""
							width="44"
							className="port-logos"
						/></Link>
						<hr className="dash-hr" />
						<h3><NEPQRModal />   <Link to="/sendTHOR"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
							<Link to="/sendTHOR">
						<div className="port-price-col">
							<span className="market-price">THOR $0.00</span>
							<h3>{numeral(
	              Math.floor(this.props.thor * 100000) / 100000
	            ).format("0,0.0000")} <span className="thor-price"> THOR</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	thor: state.wallet.Thor,
	marketTHORPrice: state.wallet.marketTHORPrice
});

PortTHOR = connect(mapStateToProps)(PortTHOR);
export default PortTHOR;
