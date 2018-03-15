import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import litecoinLogo from "../img/litecoin.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import fs from "fs";
import TransactionHistoryLTC from "./TransactionHistoryLTC";
import {  block_index} from "../components/NetworkSwitch";
import { ltcLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

const { dialog } = require("electron").remote;
const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://live.blockcypher.com/ltc/address/";
	} else {
		base = "https://live.blockcypher.com/ltc-testnet/address/";
	}
	return base + address;
};

const refreshBalance = (dispatch, net, address, litecoin_address) => {
  dispatch(sendEvent(true, "Refreshing the Litecoin blockchain may take up to 5 minutes or more. Click Morpheus logo to cancel."));
  initiateGetBalance(dispatch, net, address, ltc_address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

const saveLtcKeyRecovery = ltckeys => {
    const content = JSON.stringify(ltckeys);
    dialog.showSaveDialog(
        {
            filters: [
                {
                    name: "JSON",
                    extensions: ["json"]
                }
            ]
        },
        fileName => {
            if (fileName === undefined) {
                console.log("File failed to save...");
                return;
            }
            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, content, err => {
                if (err) {
                    alert("An error ocurred creating the file " + err.message);
                }
                alert("The file has been succesfully saved");
            });
        }
    );
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

								<div className="dash-icon-bar"
								onClick={() => saveLtcKeyRecovery(this.props.wallets)}>
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
             Sending funds other than Litecoin (LTC) to this address may result in your funds being lost.
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
	ltc_address: state.account.ltcPubAddr,
  ltc_wif: state.account.ltcPrivKey,
	marketLTCPrice: state.wallet.marketLTCPrice,
	ltcLoggedIn: state.account.ltcLoggedIn,
	ltcPrivKey: state.account.ltcPrivKey,
	ltcPubAddr: state.account.ltcPubAddr,
	wallets: state.account.ltcAccountKeys
});

ReceiveLitecoin = connect(mapStateToProps)(ReceiveLitecoin);
export default ReceiveLitecoin;
