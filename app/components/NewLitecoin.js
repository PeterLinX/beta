import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import litecoinLogo from "../img/litecoin.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setBtcBalance } from '../modules/wallet'

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

class NewLitecoin extends Component {

	constructor(props){
		super(props);
		this.state={
			pa: '',
			pk: ''
		}

		if(this.props.btcLoggedIn){
			this.props.history.push("/receiveLitecoin");
		}

	}

	getRandomAddress = async ()=>{
		let opt = this.props.net == "TestNet" ? {network: bitcoin.networks.testnet} : null;
		var keyPair = await bitcoin.ECPair.makeRandom(opt);
		let pa = keyPair.getAddress();
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


			let redirectUrl = this.props.btcLoginRedirect || "/receiveLitecoin";
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
								src={litecoinLogo}
								alt=""
								width="38"
								className="neo-logo logobounce"
							/>
							<h2>Create New Litecoin Address</h2>
							</div>
							<div className="col-xs-12 center">
								<hr className="dash-hr-wide" />
							</div>
							<div className="col-xs-12">
							<input
								className="trans-form"
								placeholder="Enter a Litecoin (LTC) private key to acces your funds"
							 	onChange={
									(val)=>{
										this.state.pk = val.target.value;
									}
								} />
							<Link>
								<div className="grey-button" onClick={()=>this.login(dispatch)} >Login</div>
							</Link>
							</div>
							<div className="col-xs-12">
							<h4 className="center">- Or -</h4>
							<Link>
							<div className="grey-button" onClick={this.getRandomAddress}>Generate new Litecoin (LTC) address</div>
							</Link>
							</div>


							{
								this.state.pk !== '' ? (
									<div className="col-xs-12">
									<h4>Private key</h4>
									<input  className="form-control-exchange" value={this.state.pk} />
									{/* {this.state.pk} */}
									<br/>
									</div>
								): null
							}

							{
								this.state.pa !== '' ? (
									<div className="col-xs-12">
									<h4>Public address</h4>
									<input className="form-control-exchange" value={this.state.pa} />
									<br/>
									</div>
								): null
							}



						<div className="clearboth" />

			<div className="clearboth" />

			</div>

				<div className="col-xs-12">
					<p className="send-notice">
                    You should store your private key off-line in a safe dry place such as a safety deposit box or fire-proof safe. Saving your private key on your computer or mobile device is not reccomended.
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
	btcLoginRedirect: state.account.btcLoginRedirect,
});

NewLitecoin = connect(mapStateToProps)(NewLitecoin);
export default NewLitecoin;
