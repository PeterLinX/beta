import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";


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
			dbcPrice: 0,
			ontPrice: 0,
			qlcPrice: 0,
			rpxPrice: 0,
			tkyPrice: 0,
			tncPrice: 0,
			zptPrice: 0
		};
	}

	render() {
		return (

			<div>

				<div className="row top-10 dash-portfolio center">


				<Link to="/sendDBC">
					<div className="col-5">
						<span className="market-price">DBC {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
						<h3>{numeral(
							Math.floor(this.props.dbc * 100000) / 100000
						).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.dbc*this.props.marketDBCPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>

					<Link to="/sendQLC">
						<div className="col-5">
							<span className="market-price">QLC {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.qlc * 100000) / 100000
							).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.qlc*this.props.marketQLCPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

					<Link to="/sendRPX">
						<div className="col-5">
							<span className="market-price">RPX {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.rpx * 100000) / 100000
							).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.rpx*this.props.marketRPXPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

					<Link to="/sendTNC">
						<div className="col-5">
							<span className="market-price">TNC {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.tnc * 100000) / 100000
							).format("0,0.0000")} <span className="hp-price"> TNC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.tnc*this.props.marketTNCPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

					<Link to="/sendZPT">
						<div className="col-5">
							<span className="market-price">ZPT {numeral(this.props.marketZPTPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.zpt * 100000) / 100000
							).format("0,0.0000")} <span className="neo-price"> ZPT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.zpt*this.props.marketZPTPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>




				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	neo: state.wallet.Neo,
	btc: state.wallet.Btc,
	dbc: state.wallet.Dbc,
	qlc: state.wallet.Qlc,
	rpx: state.wallet.Rpx,
	tnc: state.wallet.Tnc,
	zpt: state.wallet.Zpt,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketTNCPrice: state.wallet.marketTNCPrice,
	marketZPTPrice: state.wallet.marketZPTPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
