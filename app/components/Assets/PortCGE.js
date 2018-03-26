import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import cgeLogo from "../../img/cge.png";

class PortCGE extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cgePrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">
							<div className="port-logo-col">
							<img
								src={cgeLogo}
								alt=""
								width="36"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendCGE"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendCGE">
							<div className="port-price-col">
								<span className="market-price">Concierge {numeral(this.props.marketCGEPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.cge * 100000) / 100000
								).format("0,0.0000")} <span className="thor-price"> CGE</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.cge*this.props.marketCGEPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	cge: state.wallet.Cge,
	marketCGEPrice: state.wallet.marketCGEPrice
});

PortCGE = connect(mapStateToProps)(PortCGE);
export default PortCGE;
