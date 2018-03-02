import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import Assets from "./Assets";

import { btcLoginRedirect } from "../modules/account";

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://neotracker.io/address/";
	} else {
		base = "https://testnet.neotracker.io/address/";
	}
	return base + address;
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
			<Assets />
				<div className="dash-chart-panel">
					<div className="">
						<div className="col-xs-11">
							<img
								src={bitcoinLogo}
								alt=""
								width="38"
								className="neo-logo logobounce"
							/>
							<h2>Receive Bitcoin (BTC)</h2>
						</div>
						<div className="col-xs-1" />
						<hr className="dash-hr-wide" />
						<div className="clearboth" />
						<div className="col-xs-4 top-20">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.btcPubAddr} />
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
							<h5>Your Bitcoin (BTC) Public Address</h5>
							<input
								className="ledger-address top-10"
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
								id="center"
								placeholder={this.props.address}
								value={this.props.btcPubAddr}
							/>
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

								<div className="dash-icon-bar">
									<div className="icon-border">
										<span className="glyphicon glyphicon-save" />
									</div>
                Download Encrypted Key
								</div>


							</div>



						</div>
					</div>
					<div className="clearboth" />
				</div>
				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
                    Your BTC address can be used to receive Bitcoin ONLY. Sending funds other than Bitcoin (BTC) to this address may result in your funds being lost.
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

	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
});

ReceiveBitcoin = connect(mapStateToProps)(ReceiveBitcoin);
export default ReceiveBitcoin;
