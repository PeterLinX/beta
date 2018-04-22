import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
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

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};


const { dialog } = require("electron").remote;
const saveKeyRecovery = keys => {
  const content = JSON.stringify(keys);
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


class ReceiveBitcoin extends Component {

	constructor(props){
		super(props);

		if(!this.props.btcLoggedIn){
			this.props.dispatch(btcLoginRedirect("/sendBTC"));
			this.props.history.push("/newBitcoin");
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
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
							>
								<QRCode size={150} className="neo-qr pointer" value={this.props.btcPubAddr} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="light"
									effect="solid"
								>
									<span>Click to copy your Bitcoin (BTC) Address</span>
								</ReactTooltip>
							</div>
						</div>

						<div className="col-xs-12">
							<input
								className="ledger-address top-20"
								onClick={() => clipboard.writeText(this.props.btcPubAddr)}
								id="center"
								placeholder={this.props.btcPubAddr}
								value={this.props.btcPubAddr}
							/>
						</div>
						<div className="clearboth" />
						<div className="dash-bar-rec top-10">
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
								<div className="dash-icon-bar">
									<div className="icon-border">
										<span className="glyphicon glyphicon-bitcoin" />
									</div>
                Advanced Bitcoin
								</div>
							</Link>

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
