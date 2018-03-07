import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { shell } from "electron";
import axios from "axios";

import binanceLogo from "../img/binance.png";
import bittrexLogo from "../img/bittrex.png";
import bitfinexLogo from "../img/bitfinex.png";
import kucoinLogo from "../img/kucoin.png";
import nexLogo from "../img/nex.png";


// helper to open an external web link
const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};


class Affiliate extends Component {
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
				<h3>Online Exchanges</h3>
				<hr className="dash-hr-wide" />
				<div className="row top-10 center">

					<div className="col-5-exchange"
						onClick={() =>
							openExplorer("https://www.binance.com/?ref=10037289")
						}
					>
						<img
							src={binanceLogo}
							alt=""
							width="90"
							className="logobounce"
						/>
					</div>

					<div className="col-5-exchange"
						onClick={() =>
							openExplorer("https://www.kucoin.com/#/?r=E3_rO9")
						}
					>
						<img
							src={kucoinLogo}
							alt=""
							width="90"
							className="logobounce"
						/>
					</div>

					<div className="col-5-exchange"
						onClick={() =>
							openExplorer("https://bittrex.com")
						}
					>
						<img
							src={bittrexLogo}
							alt=""
							width="90"
							className="logobounce"
						/>
					</div>

					<div className="col-5-exchange"
						onClick={() =>
							openExplorer("https://www.bitfinex.com")
						}
					>
						<img
							src={bitfinexLogo}
							alt=""
							width="100"
							className="logobounce"
						/>
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
	marketQLCPrice: state.wallet.marketQLCPrice
});

Affiliate = connect(mapStateToProps)(Affiliate);

export default Affiliate;
