import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import btcLogo from "../../img/btc-logo.png";

class PortBTC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div>



						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendBTC"><img
							src={btcLogo}
							alt=""
							width="44"
							className="port-logo"
						/></Link>

						<h3><Link to="/sendBTC"><span className="glyphicon glyphicon-qrcode "/>  <span className="glyphicon glyphicon-send "/></Link></h3>
						</div>
						<Link to="/sendBTC"><div className="port-price-col">
							<span className="market-price">Bitcoin {numeral(this.props.marketBTCPrice).format("$0,0.00")}</span>
							<h3>{numeral(this.props.btc).format("0,0[.][0000]0")} <span id="no-inverse" className="btc-price"> BTC</span></h3>

							<span className="market-price">{numeral(this.props.btc * this.props.marketBTCPrice).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	btc: state.wallet.Btc,
	marketBTCPrice: state.wallet.marketBTCPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btcLoginRedirect: state.account.btcLoginRedirect
});

PortBTC = connect(mapStateToProps)(PortBTC);
export default PortBTC;
