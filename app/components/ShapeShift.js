import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import UnavailableExchange from "../components/UnavailableExchange";
import { fetchNeoStatus, sendShift } from "../modules/shapeshift";

import neoLogo from "../img/neo.png";
import NeoLogo from "./Brand/Neo";
import BtcLogo from "./Brand/Bitcoin";
import shapeshiftLogo from "../img/shapeshift.png";

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};
const shapeshiftPk = "5aad9888213a9635ecda3ed8bb2dc45c0a8d95dc36da7533c78f3eba8f765ce77538aae79d0e35642e39f208b7428631188f03c930e91f299f9eb40556f8e74d";


class ShapeShift extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
			rpxPrice: 0,
			qlcPrice: 0,
			dbcPrice: 0,
			selectedAsset: "select",
			selectedAssetToNeoRate: 0,
			maxLimit: 0,
			minLimit: 0,
			minerFee: 0,
			depositAmt: 0.000001
		};
		this.getMarketInfo = this.getMarketInfo.bind(this);
		this.handleSelectAsset = this.handleSelectAsset.bind(this);
		this.handleDepositAmtChange = this.handleDepositAmtChange.bind(this);
		this.calcExpectedNeo = this.calcExpectedNeo.bind(this);
		this.handlerOrderClick = this.handlerOrderClick.bind(this);
	}

	componentDidMount() {
		this.props.fetchNeoStatus();		
		setInterval(() => {
			this.props.fetchNeoStatus();
		}, 30000);
	}

	async getMarketInfo(asset) {
		const url = `https://shapeshift.io/marketinfo/${asset}_neo`;
		const response = await axios.get(url);
		const { data } = await response;
		this.setState({
			selectedAssetToNeoRate: data.rate,
			maxLimit: data.maxLimit,
			minLimit: data.minimum,
			minerFee: data.minerFee
		});
	}

	handleSelectAsset(e) {
		const { value } = e.target;
		this.getMarketInfo(value);
		this.setState({ selectedAsset: value });
	}

	handleDepositAmtChange(e) {
		const { value } = e.target;
		this.setState({ depositAmt: value });
	}

	handlerOrderClick() {
		const { address } = this.props;
		const { selectedAsset } = this.state;
		const shiftConfig = {
			withdrawal: address,
			pair: `${selectedAsset}_neo`,
			returnAddress: "shapeshift_address_here_based_on_selected_asset",
			apiKey: shapeshiftPk
		};
	}

	calcExpectedNeo() {
		const { depositAmt, selectedAssetToNeoRate } = this.state;
		return depositAmt * selectedAssetToNeoRate;
	}

	render() {
		if (!this.props.available && !this.props.fetching) return <UnavailableExchange exchangeName={"ShapeShift"}/>;
		return (
			<div>
				<div className="progress-bar fadeInLeft-ex" />

				<div className="row prog-info top-20">
					<div className="col-xs-2 col-xs-offset-1 sm-text center">
						Enter Amount to Deposit
					</div>
					<div className="col-xs-2 sm-text center grey-out">
						Placing Your Order</div>
					<div className="col-xs-2 sm-text center grey-out">
						Generating Deposit Address
					</div>
					<div className="col-xs-2 sm-text center grey-out">
						Processing Your Order
					</div>
					<div className="col-xs-2 sm-text center grey-out">
						Transaction Complete!
					</div>
				</div>

				<div className="top-130 dash-panel">
					<h2 className="center">ShapeShift Exchange Service</h2>
					<hr className="dash-hr-wide" />
					<div className="row top-10">

						<div className="col-xs-4">
							<select
								name="select-profession"
								id="select-profession"
								className=""
								value={this.state.selectedAsset}
								onChange={this.handleSelectAsset}
							>
								<option value="select" disabled={true}>
									Select Asset
								</option>
								<option value="btc">
									Bitcoin (BTC)
								</option>
								<option value="eth">
									Ethereum (ETH)
								</option>
								<option value="ltc">
									Litecoin (LTC)
								</option>
								<option value="xmr">
									Monero (XMR)
								</option>
							</select>
							<p className="sm-text top-10">
								Select Asset to Exchange
							</p>
						</div>

						<div className="col-xs-4">
							<input
								value={this.state.depositAmt}
								onChange={this.handleDepositAmtChange}
								className="form-control-exchange center"
								type="number"
								min={0.01}
							/>
							<p className="sm-text">
								Amount to Deposit
							</p>
						</div>


						<div className="col-xs-4">
							<input
								className="form-control-exchange center"
								value={this.calcExpectedNeo()}
								placeholder="0"
								disabled
							/>
							<p className="sm-text">
								Amount of NEO Received
							</p>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-8 top-20">

							<input
								className="form-control-exchange center"
								disabled
								placeholder={this.props.address}
							/>
							<p className="sm-text">
              Once complete, NEO will be deposited to the address above
							</p>
						</div>
						<div className="col-xs-4 center top-20">
							<button className="btn-send">
								Place Order
							</button>
						</div>
					</div>
        
					<div className="row">
						<div className="col-xs-9 top-20">
							<strong>
              Minimum Order: 0.000000
							</strong><br />
							<span className="sm-text">Transaction fees included.</span>
						</div>

						<div className="col-xs-3">
							<img
								src={shapeshiftLogo}
								alt=""
								width="160"
								className="logobounce"
							/>
						</div>

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
	fetching: state.shapeshift.fetching,
	posting: state.shapeshift.posting,
	available: state.shapeshift.available,
	error: state.shapeshift.error
});

const mapDispatchToProps = ({
	fetchNeoStatus,
	sendShift

});

ShapeShift = connect(mapStateToProps, mapDispatchToProps)(ShapeShift);

export default ShapeShift;
