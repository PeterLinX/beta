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
import { resetBalanceSync, initiateGetBalance, intervals } from "../components/NetworkSwitch";

let wif;

var bitcoin = require("bitcoinjs-lib");

// var blocktrail = require('blocktrail-sdk');

var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

const getBalanceLink = (net, addr) => {
	let url;

	if (net === "MainNet") {
		url = "https://blockexplorer.com/api/addr/" + addr + "/balance";
	} else {
		url = "https://testnet.blockexplorer.com/api/addr/" + addr + "/balance";
	}
	return url;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class LoadOldBitcoin extends Component {

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
		var keyPair = bitcoin.ECPair.fromWIF(this.props.wif);
		let pubKey = keyPair.getPublicKeyBuffer();

		let pa = keyPair.getAddress();
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
			alert("Please input your bitcoin private key");
			return;
		}

		let keyPair = await bitcoin.ECPair.fromWIF(pk, this.props.net == "TestNet" ? bitcoin.networks.testnet : null);
		let pa = keyPair.getAddress();
		if(pa != null){
			dispatch(btcLogIn(pa, pk));
			let balance = await axios.get(getBalanceLink(this.props.net, pa));
			dispatch(setBtcBalance(parseFloat(balance.data) / 100000000));
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
			<div>
				<div className="dash-panel"
        onLoad={() =>
          refreshBalance(
            this.props.dispatch,
            this.props.net,
            this.props.address,
            this.props.btc,
            this.props.ltc,
            this.props.eth
          )
        } >

						<div className="col-xs-12"
            onLoad={this.getRandomAddress}
            >
							<img
								src={bitcoinLogo}
								alt=""
								width="38"
								className="neo-logo flipInY"
							/>
							<h2>Your Bitcoin (BTC) Address</h2>
							</div>

							<div className="col-xs-12 center top-10">
								<hr className="dash-hr-wide" />
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
								<div className="btc-button" onClick={()=>this.login(dispatch)} ><span className="glyphicon glyphicon-bitcoin marg-right-5"/> Login</div>
							</Link>
							</div>
						): null
						}

			<div className="clearboth" />

      <div className="col-xs-9 top-50">

      <Link to="/advancedBitcoin">
        <div className="btc-button"><span className="glyphicon glyphicon-user marg-right-5"/> Advanced BTC Options</div>
      </Link>

      </div>



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

LoadOldBitcoin = connect(mapStateToProps)(LoadOldBitcoin);
export default LoadOldBitcoin;
