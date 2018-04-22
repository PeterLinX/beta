import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import rpxLogo from "../../img/rpx.png";

class PortRPX extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rpxPrice: 0
		};

	}

	render() {
		return (

			<div>

							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendRPX"><img
								src={rpxLogo}
								alt=""
								width="84"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendRPX"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendRPX">
							<div className="port-price-col">
								<span className="market-price">Red Pulse {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.rpx * 100000) / 100000
								).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.rpx * this.props.marketRPXPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	rpx: state.wallet.Rpx,
	marketRPXPrice: state.wallet.marketRPXPrice
});

PortRPX = connect(mapStateToProps)(PortRPX);
export default PortRPX;
