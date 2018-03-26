import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

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


						<Link to="/sendOBT">
							<div className="col-3 ">

							<div className="port-logo-col">
							<img
								src={orbLogo}
								alt=""
								width="48"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendOBT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Orbis $0.00 USD</span>
								<h3>{numeral(
		              Math.floor(this.props.obt * 100000) / 100000
		            ).format("0,0.0000")}  <span className="thor-price"> OBT</span></h3>
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
	obt: state.wallet.Obt,
	marketOBTPrice: state.wallet.marketOBTPrice
});

PortOBT = connect(mapStateToProps)(PortOBT);
export default PortOBT;
