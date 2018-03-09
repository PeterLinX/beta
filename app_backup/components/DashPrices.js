import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import btcLogo from "../img/btc-logo.png";
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


class DashPrices extends Component {
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

					<div className="col-5-price">
						<h3>{numeral(this.props.marketNEOPrice).format("$0,0.00")}
							<span className="neo-price"> NEO</span></h3>
					</div>

					<div className="col-5-price">
						<h3>{numeral(this.props.marketGASPrice).format("$0,0.00")}
							<span className="gas-price"> GAS</span></h3>
					</div>

					<div className="col-5-price">
						<h3>{numeral(this.props.marketRPXPrice).format("$0,0.00")}
							<span className="rpx-price"> RPX</span></h3>
					</div>


					<div className="col-5-price">
						<h3>{numeral(this.props.marketDBCPrice).format("$0,0.00")} <span className="dbc-price"> DBC</span></h3>
					</div>


					<div className="col-5-price">
						<h3>{numeral(this.props.marketQLCPrice).format("$0,0.00")} <span className="qlink-price"> QLC</span></h3>
					</div>

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
	marketETHPrice: state.wallet.marketETHPrice
});

DashPrices = connect(mapStateToProps)(DashPrices);

export default DashPrices;
