import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import wowooLogo from "../../img/wowoo.png";

class PortWWB extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rpxPrice: 0
		};

	}

	render() {
		return (

			<div>

							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={wowooLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendWWB"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendWWB">
							<div className="port-price-col">
								<span className="market-price">Wowoo {numeral(this.props.marketWWBPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.wwb * 100000) / 100000
								).format("0,0.0000")} <span className="rpx-price"> WWB</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.wwb * this.props.marketWWBPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	wwb: state.wallet.Wwb,
	marketWWBPrice: state.wallet.marketWWBPrice
});

PortWWB = connect(mapStateToProps)(PortWWB);
export default PortWWB;
