import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import qlcLogo from "../../img/qlc.png";

class PortQLC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			qlcPrice: 0
		};

	}


	render() {
		return (

			<div>



							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendQLC"><img
								src={qlcLogo}
								alt=""
								width="50"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendQLC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendQLC">
							<div className="port-price-col">
								<span className="market-price">QLink {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.qlc * 100000) / 100000
								).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.qlc*this.props.marketQLCPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	qlc: state.wallet.Qlc,
	marketQLCPrice: state.wallet.marketQLCPrice
});

PortQLC = connect(mapStateToProps)(PortQLC);
export default PortQLC;
