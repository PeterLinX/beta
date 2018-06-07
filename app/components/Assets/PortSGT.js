import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import sgtLogo from "../../img/sgt.png";

class PortSGT extends Component {
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
							<Link to="/sendSGT"><img
								src={sgtLogo}
								alt=""
								width="44"
								className="port-logos"
							/></Link>

							<h3><NEPQRModal />   <Link to="/sendRPX"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendSGT">
							<div className="port-price-col">
								<span className="market-price">SafeGuard {numeral(this.props.marketSGTPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.sgt * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="rpx-price"> SGT</span></h3>

								<span className="market-price">{numeral(this.props.sgt * this.props.marketSGTPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	sgt: state.wallet.Sgt,
	marketSGTPrice: state.wallet.marketSGTPrice
});

PortSGT = connect(mapStateToProps)(PortSGT);
export default PortSGT;
