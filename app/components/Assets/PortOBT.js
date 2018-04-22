import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import orbLogo from "../../img/orb.png";

class PortOBT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			obtPrice: 0
		};

	}


	render() {
		return (

			<div>



							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendOBT"><img
								src={orbLogo}
								alt=""
								width="48"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendOBT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendOBT">
							<div className="port-price-col">
								<span className="market-price">Orbis $0.00 USD</span>
								<h3>{numeral(
		              Math.floor(this.props.obt * 100000) / 100000
		            ).format("0,0.0000")}  <span className="thor-price"> OBT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	obt: state.wallet.Obt,
	marketOBTPrice: state.wallet.marketOBTPrice
});

PortOBT = connect(mapStateToProps)(PortOBT);
export default PortOBT;
