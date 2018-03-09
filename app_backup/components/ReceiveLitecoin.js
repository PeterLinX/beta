import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import litecoinLogo from "../img/litecoin.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import TransactionHistoryLTC from "./TransactionHistoryLTC";
import { syncTransactionHistory ,syncLtcTransactionHistory, block_index} from "../components/NetworkSwitch";
import { ltcLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://live.blockcypher.com/ltc/address/";
	} else {
		base = "https://live.blockcypher.com/ltc-testnet/address/";
	}
	return base + address;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class ReceiveLitecoin extends Component {

	constructor(props){
		super(props);

		if(!this.props.ltcLoggedIn){
			this.props.dispatch(ltcLoginRedirect("/ReceiveLitecoin"));
			this.props.history.push("/newLitecoin");
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
								src={litecoinLogo}
								alt=""
								width="44"
								className="neo-logo logobounce"
							/>
							<h2>Receive Litecoin (LTC)</h2>
						</div>

						<div
            className="col-xs-1 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.ltc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh font24" />
          </div>

						<div className="col-xs-3 center">
						<div className="send-panel-price">{numeral(this.props.ltc).format("0,0.0000000")} <span className="ltc-price"> LTC</span></div>

						<span className="market-price">{numeral(this.props.ltc * this.props.marketLTCPrice).format("$0,0.00")} USD</span>
						</div>

						<hr className="dash-hr-wide" />
						<div className="clearboth" />
						<div className="col-xs-4 top-20">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.ltcPubAddr} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="light"
									effect="solid"
								>
									<span>Click to copy your LTC Address</span>
								</ReactTooltip>
							</div>
						</div>

						<div className="col-xs-8">
							<div className="col-xs-12">
							<h5>Your Litecoin (LTC) Public Address</h5>
							</div>
							<div className="col-xs-10">
							<input
								className="ledger-address top-10"
								onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
								id="center"
								placeholder={this.props.address}
								value={this.props.ltcPubAddr}
							/>
							</div>
							<div className="col-xs-2 top-10">
							<Link to={ "/sendLTC" }>
							<button className="grey-button">
								<span className="glyphicon glyphicon-send"/></button>
							</Link>
							</div>


							<div className="clearboth" />
							<div className="dash-bar top-30">
								<div
									className="dash-icon-bar"
									onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
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
										openExplorer(getLink(this.props.net, this.props.ltcPubAddr))
									}
								>
									<div className="icon-border">
										<span className="glyphicon glyphicon-link" />
									</div>
                View On Blockchain
								</div>

								<div className="dash-icon-bar">
									<div className="icon-border">
										<span className="glyphicon glyphicon-save" />
									</div>
                Download Encrypted Key
								</div>

							</div>
						</div>

						<div className="col-xs-12 top-20">
						<TransactionHistoryLTC />
						</div>
					</div>
					<div className="clearboth" />
				</div>
				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
                    Your LTC address can be used to receive Bitcoin ONLY. Sending funds other than Litecoin (LTC) to this address may result in your funds being lost.
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
	ltc: state.wallet.Ltc,
	marketLTCPrice: state.wallet.marketLTCPrice,
	ltcLoggedIn: state.account.ltcLoggedIn,
	ltcPrivKey: state.account.ltcPrivKey,
	ltcPubAddr: state.account.ltcPubAddr,
});

ReceiveLitecoin = connect(mapStateToProps)(ReceiveLitecoin);
export default ReceiveLitecoin;
