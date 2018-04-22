import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import neoLogo from "../../img/neo.png";

class PortNEO extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};

	}


	render() {
		return (

			<div>


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/send"><img
							src={neoLogo}
							alt=""
							width="36"
							className="port-logos"
						/></Link>
						<hr className="dash-hr" />
						<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/send"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div><Link to="/send">
						<div className="port-price-col">
							<span className="market-price">NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}</span>
							<h3>{numeral(this.props.neo).format("0,0")} <span className="neo-price"> NEO</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.price).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	price: state.wallet.price,
	marketNEOPrice: state.wallet.marketNEOPrice,
});

PortNEO = connect(mapStateToProps)(PortNEO);
export default PortNEO;
