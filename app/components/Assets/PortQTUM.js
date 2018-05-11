import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import qtumLogo from "../../img/qtum.png";
import NEPQRModal from "./NEPQRModal.js";

class PortQTUM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dbcPrice: 0
		};

	}


	render() {
		return (

			<div>
							<div className="col-3 flipInX">
							<div className="port-logo-col">
							<img
								src={qtumLogo}
								alt=""
								width="44"
								className="port-logos"
							/>

							<h3><NEPQRModal />   <Link to="/sendQTUM"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendQTUM">
							<div className="port-price-col">
								<span className="market-price">QTUM {numeral(this.props.marketQTUMPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.qtum * 100000) / 100000
								).format("0,0[.][0000]")} <span className="dbc-price"> QTUM</span></h3>

								<span className="market-price">{numeral(this.props.qtum*this.props.marketQTUMPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	qtum: state.wallet.Qtum,
	marketQTUMPrice: state.wallet.marketQTUMPrice,
});

PortQTUM = connect(mapStateToProps)(PortQTUM);
export default PortQTUM;
