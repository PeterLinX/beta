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

var bitcoin = require('bitcoinjs-lib');

// var blocktrail = require('blocktrail-sdk');

var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

const getBalanceLink = (net, addr) => {
	let url;

	if (net === "MainNet") {
		url = 'https://blockexplorer.com/api/addr/' + addr + '/balance';
	} else {
		url = 'https://testnet.blockexplorer.com/api/addr/' + addr + '/balance';
	}
	return url;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class NewBitcoin extends Component {

	constructor(props){
		super(props);
		this.state={
			pa: '',
			pk: ''
		}

		if(this.props.btcLoggedIn){
			this.props.history.push("/receiveBitcoin");
		}

	}

	getRandomAddress = async ()=>{
		let opt = this.props.net == "TestNet" ? {network: bitcoin.networks.testnet} : null;
		//var keyPair = bitcoin.ECPair.fromWIF(this.props.wif);
		var keyPair = bitcoin.ECPair.makeRandom(opt);
		let pubKey = keyPair.getPublicKeyBuffer();
        var scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));
		let pa = bitcoin.address.fromOutputScript(scriptPubKey);
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
			// alert("address: " + pa + "\nbalance: " + JSON.stringify(balance.data));
			dispatch(setBtcBalance(parseFloat(balance.data) / 100000000));

			// var client = blocktrail.BlocktrailSDK({apiKey: key, apiSecret: secret, network: "BTC", testnet: this.props.net == "TestNet"});

			// client.address(pa, function(err, address) { alert(address.balance); });


			let redirectUrl = this.props.btcLoginRedirect || "/receiveBitcoin";
			let self = this;
			setTimeout(()=>{
				self.props.history.push(redirectUrl);
			}, 1000);
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
							<h2>Login or Create New Bitcoin Address</h2>
							</div>

						<div className="col-xs-9">

						<input
							className="form-control-exchange"
							placeholder="Enter a Bitcoin or NEO private key"
							type="password"
							onChange={
								(val)=>{
									this.state.pk = val.target.value;
								}
							} />
						</div>

						<div className="col-xs-3">
						<Link>
							<div className="btc-button" onClick={()=>this.login(dispatch)} ><span className="glyphicon glyphicon-eye-close marg-right-5"/> Login</div>
						</Link>
						</div>

						<div className="col-xs-12 center top-10">
							<hr className="dash-hr-wide" />
						</div>

						<div className="col-xs-9 top-10">
						<p className="btc-notice">You can use an existing Bitcoin Private Key to load your BTC funds or use your NEO Priavte Key to unlock your Bitcoin (BTC) address. If you would like to generate a new random Bitcoin (BTC) address, click the "New" button.</p>
						</div>

						<div className="col-xs-3">
						<Link>
							<div className="btc-button top-20 com-soon" onClick={this.getRandomAddress}><span className="glyphicon glyphicon-bitcoin marg-right-5"/> New</div>
						</Link>

						<p className="btc-notice">Click "View" to load your BTC address then click the "Login" button to access your BTC wallet in Morpheus. You can access your Bitcoin address in other wallets using your NEO Private Key.</p>


						<div className="col-xs-3">

						<Link>
							<div className="btc-button top-20 com-soon" onClick={this.getRandomAddress}><span className="glyphicon glyphicon-bitcoin marg-right-5"/> View</div>

						</Link>

						</div>

						<div className="col-xs-12 center top-10">
							<hr className="dash-hr-wide" />
						</div>


						{
							this.state.pk !== '' ? (

								<div className="col-xs-12 top-10">
								<h4>New Bitcoin (BTC) Private Key</h4>
								<input  className="form-control-exchange" value={this.state.pk} />
								{/* {this.state.pk} */}
								<br/>
								</div>
							): null
						}


						{
							this.state.pa !== '' ? (
								<div className="col-xs-9">
									>>>>>>> a47b40218f50717fe960a1a6e2e83ff4ba413435
								<h4>New Bitcoin (BTC) Public Address</h4>
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

		<div className="clearboth" />
		</div>

						<div className="col-xs-12">
							<p className="send-notice">
							You should store your private key off-line in a safe dry place such as a safety deposit box or fire-proof safe.
							</p>

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

NewBitcoin = connect(mapStateToProps)(NewBitcoin);
export default NewBitcoin;
