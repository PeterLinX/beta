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
			iamPrice: 0,
			nrvePrice: 0,
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

				<Link to="/sendACAT">
					<div className="col-5">
						<span className="market-price">ACAT {numeral(this.props.marketACATPrice).format("$0,0.00")}</span>
						<h3>{numeral(
							Math.floor(this.props.acat * 100000) / 100000
						).format("0,0.000")} <span className="ltc-price"> ACAT</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.acat*this.props.marketACATPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>


				<Link to="/sendIAM">
					<div className="col-5">
						<span className="market-price">IAM {numeral(this.props.marketIAMPrice).format("$0,0.00")}</span>
						<h3>{numeral(
							Math.floor(this.props.iam * 100000) / 100000
						).format("0,0.000")} <span className="qlink-price"> IAM</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.iam*this.props.marketIAMPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>



					<Link to="/sendCGE">
						<div className="col-5">
							<span className="market-price">CGE {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.cge * 100000) / 100000
							).format("0,0.000")} <span className="thor-price"> CGE</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.cge*this.props.marketCGEPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

					<Link to="/sendNRVE">
						<div className="col-5">
							<span className="market-price">NRVE {numeral(this.props.marketNRVEPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.nrve * 100000) / 100000
							).format("0,0.000")} <span className="dbc-price"> NRVE</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.nrve*this.props.marketNRVEPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

					<Link to="/sendOBT">
						<div className="col-5">
							<span className="market-price">THOR {numeral(this.props.marketTHORPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.thor * 100000) / 100000
							).format("0,0.000")} <span className="thor-price"> THOR</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.thor*this.props.marketTHORPrice).format("$0,0.00")} USD</span>
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
	acat: state.wallet.Acat,
	cge: state.wallet.Cge,
	iam: state.wallet.Iam,
	nrve: state.wallet.Nrve,
	thor: state.wallet.Thor,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketACATPrice: state.wallet.marketACATPrice,
	marketIAMPrice: state.wallet.marketIAMPrice,
	marketCGEPrice: state.wallet.marketCGEPrice,
	marketNRVEPrice: state.wallet.marketNRVEPrice,
	marketTHORPrice: state.wallet.marketTHORPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
