import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setBtcBalance } from '../modules/wallet'
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { btcLogIn, btcLoginRedirect } from '../modules/account';
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import { setBtcBlockHeight } from "../modules/metadata";
import Modal from "react-modal";

var bitcoin = require('bitcoinjs-lib');

// var blocktrail = require('blocktrail-sdk');

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
        <h2 className="top-20 center">Advanced Bitcoin Options</h2>
              <Link to="/loadOldBitcoin">
              <div className="col-2 center">
              <img
                src={bitcoinLogo}
                alt="Bitcoin"
                width="72"
                className="center"
              />
              <br />
                <h3>Unlock Legacy Your Address</h3>
              </div>
              </Link>

              <Link to="/loadClassicBitcoin">
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center"
							/>
              <br />
                <h3>Load Legacy Address from Private Key</h3>
							</div>
              </Link>
              <Link to="/loadSegwitBitcoin">
							<div className="col-2 center">
              <img
								src={bitcoinLogo}
								alt="Bitcoin"
								width="72"
								className="center"
							/>
              <br />
                <h3>Load Segwit Address from Private Key</h3>
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
