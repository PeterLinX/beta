import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";
import Claim from "./Claim.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};

class TopBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0
		};
	}

	render() {
		return (
			<div id="send">
				<div className="header">
				<Link to="/send">
					<div className="col-xs-4 pointer">

						<p className="neo-text">
							{numeral(this.props.neo).format("0,0")} <span id="no-inverse">NEO</span>
						</p>
						<p className="neo-balance">
							{numeral(this.props.price).format("$0,0.00")} USD
						</p>
						<hr className="dash-hr" />
						<p className="market-price center">
                {numeral(this.props.marketNEOPrice).format("$0,0.00")} each
						</p>
					</div>
					</Link>
					<div id="no-inverse" className="col-xs-4">{<Claim />}</div>
					<Link to="/send">
					<div className="col-xs-4 top-5 pointer">

						<p className="gas-text">
							{numeral(
								Math.floor(this.props.gas * 10000000) / 10000000
							).format("0,0[.][000000]")}{" "}
							<span id="no-inverse">GAS</span>
						</p>
						<p className="neo-balance">
							{" "}
							{numeral(Math.round(this.props.gasPrice * 100) / 100).format("$0,0.00")}{" "} USD
						</p>
						<hr className="dash-hr" />
						<p className="market-price center">
            {numeral(this.props.marketGASPrice).format("$0,0.00")} each
						</p>
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
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice
});

TopBar = connect(mapStateToProps)(TopBar);

export default TopBar;
