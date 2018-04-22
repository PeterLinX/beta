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
			this.props.dispatch(ltcLoginRedirect("/sendLTC"));
			this.props.history.push("/newLitecoin");
		}
	}

	render() {
		console.log(this.props.net);
		return (
			<div>

						<div className="col-xs-8 col-xs-offset-2">


							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.ltcPubAddr} />
								</div>

						</div>


						<ReactTooltip
							className="solidTip"
							id="qraddTip"
							place="top"
							type="light"
							effect="solid"
						>
							<span>Click to copy your LTC Address</span>
						</ReactTooltip>


						<div className="col-xs-12">

							<input
								className="ledger-address top-10"
								onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
								id="center"
								placeholder={this.props.address}
								value={this.props.ltcPubAddr}
							/>

							<div className="clearboth" />
							<div className="dash-bar-rec top-10">
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
<div className="clearboth" />

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
