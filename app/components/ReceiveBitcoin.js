import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from "axios";
import numeral from "numeral";
import TransactionHistoryBTC from "./TransactionHistoryBTC";
import { btcLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { syncTransactionHistory ,syncBtcTransactionHistory, block_index} from "../components/NetworkSwitch";

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://live.blockcypher.com/btc/address/";
	} else {
		base = "https://live.blockcypher.com/btc/address/";
	}
	return base + address;
};

const refreshBalance = (dispatch, net, address, btc_address) => {
  dispatch(sendEvent(true, "Refreshing the Bitcoin blockchain may take up to 5 minutes or more. Click Morpheus logo to cancel."));
  initiateGetBalance(dispatch, net, address, btc_address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information.  Click Morpheus logo to refresh balances is needed."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class ReceiveBitcoin extends Component {

	constructor(props){
		super(props);

		if(!this.props.btcLoggedIn){
			this.props.dispatch(btcLoginRedirect("/receiveBitcoin"));
			this.props.history.push("/newBitcoin");
		}
	}

	render() {
		console.log(this.props.net);
		return (
			<div id="" className="">
				<div className="dash-panel">
					<div className="">
						<div className="col-xs-8">
							<img
								src={bitcoinLogo}
								alt=""
								width="45"
								className="neo-logo logobounce"
							/>
							<h2>Receive Bitcoin (BTC)</h2>
						</div>

						<div
            className="col-xs-1 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.btc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh font24" />
          </div>

						<div className="col-xs-3 center">
						<div className="send-panel-price">{numeral(this.props.btc).format("0,0.0000000")} <span className="btc-price"> BTC</span></div>

						<span className="market-price">{numeral(this.props.btc * this.props.marketBTCPrice).format("$0,0.00")} USD</span>
						</div>


						<hr className="dash-hr-wide" />
						<div className="clearboth" />
						<div className="col-xs-4 top-20">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
							>
								<QRCode size={130} className="neo-qr" value={this.props.btcPubAddr} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="light"
									effect="solid"
								>
									<span>Click to copy your BTC Address</span>
								</ReactTooltip>
							</div>
						</div>

						<div className="col-xs-8">
						<div className="col-xs-12">
						<h5>Your Bitcoin (BTC) Public Address</h5>
						</div>
						<div className="col-xs-10 top-10">
							<input
								className="ledger-address"
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
								id="center"
								placeholder={this.props.address}
								value={this.props.btcPubAddr}
							/>
							</div>
							<div className="col-xs-2 top-10">
							<Link to={ "/sendBTC" }>
							<button className="btc-button">
								<span className="glyphicon glyphicon-send"/></button>
							</Link>
							</div>


							<div className="clearboth" />
							<div className="dash-bar top-30">
								<div
									className="dash-icon-bar"
									onClick={() => clipboard.writeText(this.props.btcPubAddr)}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-duplicate" />
									</div>
                Copy Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() => print()}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-print" />
									</div>
                Print Public Address
								</div>

								<div
									className="dash-icon-bar"
									onClick={() =>
										openExplorer(getLink(this.props.net, this.props.btcPubAddr))
									}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-link" />
									</div>
                View On Blockchain
								</div>

								<Link to="/advancedBitcoin">
								<div className="dash-icon-bar not-active">
									<div className="icon-border">
										<span className="glyphicon glyphicon-user" />
									</div>
                Advanced BTC Options
								</div>
								</Link>


							</div>



						</div>
					</div>

					<div className="col-xs-12 top-10">
					<TransactionHistoryBTC />
					</div>


					<div className="clearboth" />
				</div>
				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
           Sending funds other than Bitcoin (BTC) to this address may result in your funds being lost.
					</p>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	net: state.metadata.network,
	address: state.account.address,
	neo: state.wallet.Neo,
	price: state.wallet.price,
	gas: state.wallet.Gas,
	btc: state.wallet.Btc,
	marketBTCPrice: state.wallet.marketBTCPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btcLoginRedirect: state.account.btcLoginRedirect
});

ReceiveBitcoin = connect(mapStateToProps)(ReceiveBitcoin);
export default ReceiveBitcoin;
