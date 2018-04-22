import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from "axios";
import { setBtcBalance } from "../modules/wallet";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { btcLogIn, btcLoginRedirect } from "../modules/account";
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import { setBtcBlockHeight } from "../modules/metadata";
import Modal from "react-modal";

var bitcoin = require("bitcoinjs-lib");

// var blocktrail = require('blocktrail-sdk');



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


var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

const getBalanceLink = (net, address) => {
	let url;

	if (net === "MainNet") {
		url = 'https://blockexplorer.com/api/addr/' + address + '/balance';
	} else {
		url = 'https://testnet.blockexplorer.com/api/addr/' + address + '/balance';
	}
	return url;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};


class AdvancedBitcoin extends Component {
	render() {

		const dispatch = this.props.dispatch;

		console.log(this.props.net);
		return (
			<div>

				<div className="top-20">
              <Link to="/SweepBitcoin">
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center flipInY"
							/>
              <br />
                <h3>Transfer Bitcoin from v0.0.56 BTC Address</h3>
                <p className="com-soon">Quickly transfer BTC from Morpheus v0.0.56 to your new address using this tool.</p>
							</div>
              </Link>

              <Link to="/SweepBitcoinOther">
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center flipInY"
							/>
              <br />
                <h3>Transfer Bitcoin via<br />Private Key</h3>
                <p className="com-soon">Quickly transfer BTC from any BTC address to Morpheus using this tool.</p>
							</div>
              </Link>

              <Link to="/loadClassicBitcoin">
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center flipInY"
							/>
              <br />
                <h3>Load BTC via Private Key</h3>
                <p className="com-soon">Quickly load BTC from private key to Morpheus using this tool. You can only log into one BTC address at a time.</p>
							</div>
              </Link>

              <Link
              onClick={() => saveKeyRecovery(this.props.btcPrivKey)}
              >
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center flipInY"
							/>
              <br />
                <h3>Export BTC Private Key</h3>
                <p className="com-soon">You must be logged in to export your BTC Private Key</p>
							</div>
              </Link>



						<div className="clearboth" />

			<div className="clearboth" />
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
	wif: state.account.wif,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btcLoginRedirect: state.account.btcLoginRedirect,
});

AdvancedBitcoin = connect(mapStateToProps)(AdvancedBitcoin);
export default AdvancedBitcoin;
