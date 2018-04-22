import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

class Assets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};
	}

	render() {
		return (

			<div>

				<div className="row top-10 dash-portfolio center">


				<Link to="/sendLRN">
					<div className="col-5">
						<span className="market-price">Loopring {numeral(this.props.marketLRNPrice).format("$0,0.000")}</span>
						<h3>{numeral(
							Math.floor(this.props.lrn * 100000) / 100000
						).format("0,0.000")} <span className="ltc-price"> LRN</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.lrn*this.props.marketLRNPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>


					<Link to="/sendBTC">
						<div className="col-5">
							<span className="market-price">Bitcoin {numeral(this.props.marketBTCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.btc * 100000) / 100000
							).format("0,0.000")} <span className="btc-price"> BTC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.btc*this.props.marketBTCPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>


					<Link to="/sendETH">
						<div className="col-5">
							<span className="market-price">Ethereum {numeral(this.props.marketETHPrice).format("$0,0.00")}</span>
							<h3>{numeral(this.props.eth/10000000000).format("0,0.0000")} <span className="eth-price"> ETH</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral((this.props.eth/10000000000) * this.props.marketETHPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>


					<Link to="/sendLTC">
						<div className="col-5">
							<span className="market-price">Litecoin {numeral(this.props.marketLTCPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.ltc * 100000) / 100000
							).format("0,0.000")} <span className="eth-price"> LTC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.ltc*this.props.marketLTCPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>


					<Link to="/sendONT">
						<div className="col-5">
							<span className="market-price">Ontology {numeral(this.props.marketONTPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.ont * 100000) / 100000
							).format("0,0.000")} <span className="dbc-price"> ONT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.ont*this.props.marketONTPrice).format("$0,0.00")} USD</span>
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
	lrn: state.wallet.Lrn,
	ltc: state.wallet.Ltc,
	eth: state.wallet.Eth,
	ont: state.wallet.Ont,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketLRNPrice: state.wallet.marketLRNPrice,
	marketONTPrice: state.wallet.marketONTPrice,
	marketETHPrice: state.wallet.marketETHPrice,
	marketLTCPrice: state.wallet.marketLTCPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btc: state.wallet.Btc,
	marketBTCPrice: state.wallet.marketBTCPrice
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
