import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
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

							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendWWB"><img
								src={wowooLogo}
								alt=""
								width="44"
								className="port-logos"
							/></Link>

							<h3><NEPQRModal />   <Link to="/sendWWB"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendWWB">
							<div className="port-price-col">
								<span className="market-price">Wowoo {numeral(this.props.marketWWBPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.wwb * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="rpx-price"> WWB</span></h3>

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
