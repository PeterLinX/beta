import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import bitcoinLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import rpxLogo from "../img/rpx.png";
import qlinkLogo from "../img/qlink.png";
import thekeyLogo from "../img/thekey.png";
import nexLogo from "../img/nex.png";
import deepLogo from "../img/deep.png";
import hashpuppiesLogo from "../img/hashpuppies.png";


// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};


class Assets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
			rpxPrice: 0,
			qlcPrice: 0,
			dbcPrice: 0
		};
	}

	render() {
		return (

			<div>

				<div className="row top-10 dash-portfolio center">

				<Link  to={ "/sendBTC" }>
					<div className="col-5">
						<span className="market-price">BTC {numeral(this.props.marketBTCPrice).format("$0,0.00")}</span>
						<h3>{numeral(this.props.btc).format("0,0.00000")} <span className="btc-price"> BTC</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.btc * this.props.marketBTCPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>


					<Link to="/sendRPX">
						<div className="col-5">
							<span className="market-price">RPX {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.rpx * 100000) / 100000
							).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
					</Link>


					<Link to="/sendDBC">
						<div className="col-5">
							<span className="market-price">DBC {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.bdc * 100000) / 100000
							).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
					</Link>


					<Link to="/sendQLC">
						<div className="col-5">
							<span className="market-price">QLC {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.qlc * 100000) / 100000
							).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
					</Link>


					<Link to="/sendHP">
						<div className="col-5">
							<span className="market-price">Priceless</span>
							<h3>{numeral(
								Math.floor(this.props.rhpt * 10) / 10
							).format("0,0")} <span className="hp-price"> RHPT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
					</Link>


				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	rpx: state.wallet.Rpx,
	dbc: state.wallet.Dbc,
	qlc: state.wallet.Qlc,
	Rhpt: state.wallet.Rhpt,
	btc: state.wallet.Btc,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
