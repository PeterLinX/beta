import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
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


class LoadClassicBitcoin extends Component {

	constructor(props){
		super(props);
		this.state={
			pa: '',
			pk: ''
		}

		if(this.props.btcLoggedIn){
			this.props.history.push("/sendBTC");
		}

	}

	getRandomAddress = async ()=>{
		let opt = this.props.net == "TestNet" ? {network: bitcoin.networks.testnet} : null;
		//var keyPair = bitcoin.ECPair.fromWIF(this.props.wif);
    var keyPair = bitcoin.ECPair.fromWIF(this.props.wif);
		let pubKey = keyPair.getPublicKeyBuffer();
		var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(pubKey));
		let pa = bitcoin.address.fromOutputScript(scriptPubKey);
		console.log("btc public address");
		console.log(pa);
		let pk = keyPair.toWIF();
		this.setState({
			pa: pa,
			pk: pk,
		});
	};

	login = async (dispatch) => {
		let pk = this.state.pk;
		if(pk == '') {
			 dispatch(sendEvent(false,"Please enter a valid bitcoin private key"));
      setTimeout(() => dispatch(clearTransactionEvent()), 100);
      return false;
		}

		let keyPair = await bitcoin.ECPair.fromWIF(pk, this.props.net == "TestNet" ? bitcoin.networks.testnet : null);
		let pa = keyPair.getAddress();
		if(pa != null){
			dispatch(btcLogIn(pa, pk));

			let balance = await axios.get(getBalanceLink(this.props.net, pa));
			// alert("address: " + pa + "\nbalance: " + JSON.stringify(balance.data));
			dispatch(setBtcBalance(parseFloat(balance.data) / 100000000));

            let base,btc_blockheight;
            if(this.props.net == "MainNet") {
                base = "http://api.blockcypher.com/v1/btc/main/addrs/"+pa;
            }	else {
                base = "http://api.blockcypher.com/v1/btc/test3/addrs/"+pa;
            }

            let response = await axios.get(base);
            let trans = response.data.txrefs;
            if (trans !== undefined) {
                btc_blockheight =  trans[0].block_height
            } else {
                btc_blockheight = 0;
            }

			dispatch(setBtcBlockHeight(btc_blockheight));
			// var client = blocktrail.BlocktrailSDK({apiKey: key, apiSecret: secret, network: "BTC", testnet: this.props.net == "TestNet"});
			// client.address(pa, function(err, address) { alert(address.balance); });

			let redirectUrl = this.props.btcLoginRedirect || "/sendBTC";
			let self = this;
			setTimeout(()=>{
				self.props.history.push(redirectUrl);
			}, 10);
		}else{
			alert("Failed to login");
		}

		this.setState({
			pa: pa,
			pk: ''
		});
	}

	render() {

		const dispatch = this.props.dispatch;

		console.log(this.props.net);
		return (
			<div id="" className="">
				<div className="dash-panel">

						<div className="col-xs-12">
							<img
								src={bitcoinLogo}
								alt=""
								width="38"
								className="neo-logo logobounce"
							/>
							<h2>Enter your Bitcoin (BTC) WIF/Private Key</h2>
							</div>


							<div className="col-xs-12 center">
								<hr className="dash-hr-wide" />
							</div>

							<div className="col-xs-9 top-10">

								<input
									className="form-control-exchange"
									placeholder="Enter a Bitcoin private key to load funds"
									type="password"
									onChange={
										(val)=>{
											this.state.pk = val.target.value;
										}
									} />

                  <p className="btc-notice" top-30>Please ensure that your Bitcoin private key is backed up. Entering your BTC private key here will allow you access to your Bitcoin. Your BTC private key and public address will not be saved in Morpheus.</p>
							</div>

							<div className="col-xs-3 top-10">
								<Link>
									<div className="btc-button" onClick={()=>this.login(dispatch)} ><span className="glyphicon glyphicon-eye-close marg-right-5"/> Login</div>
								</Link>
							</div>


							{
								this.state.pa !== '' ? (
									<div className="col-xs-9">
									<h4>Bitcoin (BTC) Public Address</h4>
									<input className="form-control-exchange" value={this.state.pa} />
									<br/>
									</div>
								): null
							}



							{
								this.state.pa !== '' ? (
									<div className="col-xs-3 top-50">
							<Link>
								<div className="btc-button" onClick={()=>this.login(dispatch)} ><span className="glyphicon glyphicon-eye-close marg-right-5"/> Login</div>
							</Link>
							</div>
						): null
						}

						<div className="clearboth" />

            <div className="col-xs-12 center top-30">
              <hr className="dash-hr-wide" />
            </div>

            <div className="col-xs-2">
            <Link to="/advancedBitcoin">
            <div className="grey-button">Back</div>
            </Link>
            </div>


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

LoadClassicBitcoin = connect(mapStateToProps)(LoadClassicBitcoin);
export default LoadClassicBitcoin;
