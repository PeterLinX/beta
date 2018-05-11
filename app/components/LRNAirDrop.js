import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import Modal from "react-modal";
import { api, wallet, sc, rpc, u } from "@cityofzion/neon-js";
import ReactTooltip from "react-tooltip";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";
import lrnLogo from "../img/lrnbg.png";
import { ASSETS,TOKEN_SCRIPT,TOKEN_SCRIPT_TEST } from "../core/constants";
import asyncWrap from "../core/asyncHelper";
import { flatten } from 'lodash'
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import {oldMintTokens} from "../core/oldMintTokens";
import { Link } from "react-router";
import numeral from "numeral";
import TopBar from "./TopBar";


let payment_method, token_script, amount;

const styles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.75)"
	},
	content: {
		margin: "100px auto 0",
		padding: "30px 30px 30px 30px",
		border: "4px solid #222",
		background: "rgba(12, 12, 14, 1)",
		borderRadius: "20px",
		top: "0",
		height: 480,
		width: 600,
		left: "15%",
		right: "0",
		bottom: "0",
		boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
	}
};


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

// Implement ICO for NEP5
//Checking validate Mint Tokens Inputs
const validateMintTokensInputs = (
	neoToMint,//Number
	gasToMint,//Number
	scriptHash,//string
	NEO,//Number
	GAS //Number
) => {
	let message;

	if (neoToMint < 0 || gasToMint < 0 || (neoToMint ===0 && gasToMint === 0)) {
		message = 'You must send positive amounts of NEO or GAS.';
		return [false,message];
	}

	if (neoToMint && parseFloat(neoToMint) !== parseInt(neoToMint)) {
		message = 'You cannot send fractional NEO to a token sale.';
		return [false, message];
	}

	if ((neoToMint && isNaN(neoToMint)) || (gasToMint && isNaN(gasToMint))) {
		message = 'Please enter valid numbers only';
		return [false, message];
	}

	if (neoToMint > NEO) {
		message = 'You do not have enough NEO to send.';
		return [false, message];
	}

	if (gasToMint > GAS) {
		message = 'You do not have enough GAS to send.';
		return [false, message];
	}

	if (
		scriptHash.slice(0, 1) !== '0x' &&
		scriptHash.length !== 42 &&
		scriptHash.length !== 40
	) {
		message = 'Not a valid script hash.';
		return [false, message];
	}

	return [true, ''];
}

const participateInSaleEvent = (dispatch, wif, neo, gas, net, address) => {
	let neoToSend, gasToSend, scriptHash;
	if (payment_method.value === "NEO") {
		neoToSend = amount.value;
		gasToSend = '0';
	} else if (payment_method.value === "GAS") {
		neoToSend = '0';
		gasToSend = amount.value;
	} else {
		neoToSend = '0';
		gasToSend = '0';
	}

	console.log("neoToSend = " + neoToSend);
	console.log("gasTosend = " + gasToSend);
	if (token_script.value !== undefined || token_script.value !== '') {
		scriptHash = token_script.value;
	} else {
		dispatch(sendEvent(false,"Please select token!"));
	}

	console.log("scriptHash = " + scriptHash);
	participateInSale(
	neoToSend,
		gasToSend,
		scriptHash,
		'0',
		dispatch,
		wif,
		null,
		neo,
		gas,
		net,
		address
	).then(success => {
		if (success) {
			dispatch(sendEvent(true,"Congratualtions. Token purchase was successful!"));
			return true;
		} else {
			dispatch(sendEvent(false,"Nope. Your transaction failed. Please try again shortly."));
			return false;
		}
	})
}


const validateOldMintTokensInputs = (
	neoToMint,
	gasToMint,
	scriptHash,
	NEO,
	GAS
) => {
	let message

	if (neoToMint < 0 || gasToMint < 0 || (neoToMint ===0 && gasToMint === 0)) {
		  message = 'You must send positive amounts of NEO or GAS.';
  		return [false,message];
  	}

	if (neoToMint && parseFloat(neoToMint) !== parseInt(neoToMint)) {
		message = 'You cannot send fractional NEO to a token sale.'
		return [false, message]
	}

	if (neoToMint && isNaN(neoToMint) || (gasToMint && isNaN(gasToMint))) {
		message = 'Please enter valid numbers only'
		return [false, message]
	}

	if (neoToMint > NEO) {
		message = 'You do not have enough NEO to send.'
		return [false, message]
	}

	if (gasToMint > GAS) {
		  message = 'You do not have enough GAS to send.';
		  return [false, message];
  	}

	if (
		scriptHash.slice(0, 1) !== '0x' &&
		scriptHash.length !== 42 &&
		scriptHash.length !== 40
	) {
		message = 'Not a valid script hash.'
		return [false, message]
	}

	return [true, '']
}

const oldParticipateInSaleEvent = (dispatch, wif, neo, gas, net, address) => {
	let neoToSend, gasToSend, scriptHash;
	if (payment_method.value === "NEO") {
		neoToSend = amount.value;
		gasToSend = '0';
	} else if (payment_method.value === "GAS") {
		neoToSend = '0';
		gasToSend = amount.value;
	} else {
		neoToSend = '0';
		gasToSend = '0';
	}

	console.log("token_script = "+ token_script)
	if (token_script.value !== undefined || token_script.value !== '') {
		scriptHash = token_script.value;
	} else {
		dispatch(sendEvent(false,"Please select token!"));
	}

	oldParticipateInSale(
	neoToSend,
	gasToSend,
		scriptHash,
		'0',
		dispatch,
		wif,
		null,
		neo,
		gas,
		net,
		address
	).then(success => {
		if (success) {
			dispatch(sendEvent(true,"Congratulations. ICO tokens purchased successfully! Your balance will be updated shortly."));
			setTimeout(() => dispatch(clearTransactionEvent()), 5000);
				return true;
		} else {
			dispatch(sendEvent(false,"Sorry, transaction failed. Please try again soon."));
			setTimeout(() => dispatch(clearTransactionEvent()), 3000);
				return false;
		}
	})

}

const oldParticipateInSale = async(
	neoToSend,
  gasToSend,
	scriptHash,
	gasCost,
	dispatch,
	wif,
	publicKey,
	neo,
	gas,
	net,
	address
) => {
	const neoToMint = Number(neoToSend);
  const gasToMint = Number(gasToSend);
	const [isValid, message] = validateOldMintTokensInputs(
		neoToMint,
		gasToMint,
		scriptHash,
		neo,
		gas
	);

	if (!isValid) {
		dispatch(sendEvent(false,message));
		return false;
	}

	const _scriptHash =
		scriptHash.length === 40
			? scriptHash
			: scriptHash.slice(2, scriptHash.length)

	const wifOrPublicKey = wif;
	const [error ,response] = await asyncWrap(
		oldMintTokens(
			net,
			_scriptHash,
			wifOrPublicKey,
			neoToMint,
	  gasToMint,
			0
		)
	)


	if (error || !response || !response.result) {
		return false
	}

	return true;

}

const participateInSale = async(
	neoToSend,//string
	gasToSend,//string
	scriptHash,//string
	gasCost,//string
	dispatch,
	wif,//string
	publicKey,//string
	neo,
	gas,
	net,
	address
) => {
	const account = new wallet.Account(wif);
	const neoToMint = Number(neoToSend);
	const gasToMint = Number(gasToSend);

	const [isValid, message] = validateMintTokensInputs(
		neoToMint,
		gasToMint,
		scriptHash,
		neo,
		gas
	);

	if(!isValid) {
		dispatch(sendEvent(false, message));
		return false;
	}

	const _scriptHash =
		scriptHash.length === 40
			? scriptHash
			: scriptHash.slice(2, scriptHash.length);

	const scriptHashAddress = wallet.getAddressFromScriptHash(_scriptHash);
	console.log("scriptHashAddress = " + scriptHashAddress);
	const intents = [[ASSETS.NEO, neoToMint], [ASSETS.GAS, gasToMint]]
		.filter(([symbol, amount]) => amount > 0)
		.map(([symbol, amount]) =>
			api.makeIntent({ [symbol]: amount }, scriptHashAddress)
		);

	const script = {
		scriptHash: _scriptHash,
		operation: 'mintTokens',
		args: []
	};

	const config = {
		net,
		address,
		privateKey: account.privateKey,
		intents: flatten(intents),
		script,
		gas: 0,
		publicKey: null,
		signingFunction:  null
	};

	const [error, response] = await asyncWrap(api.doInvoke(config));
	console.log("error = " + JSON.stringify(error));
	console.log("token sale response = " + JSON.stringify(response));
	if (error !== null || error!== undefined || response === null || response === undefined
	|| response.response === null || response.response === undefined || response.response.result === false) {
		//dispatch(sendEvent(false,'Sale participation failed, please check your script hash again.'));
		return false
	}
	return true;
}

const StatusMessage = ({ sendAmount, sendTokenScript, handleCancel, handleConfirm }) => {
	let message = (
		<Modal
			isOpen={true}
			closeTimeoutMS={5}
			style={styles}
			contentLabel="Modal"
			ariaHideApp={false}
		>
			<div>
				<div className="center modal-alert">
				</div>
				<div className="center modal-alert top-20">
		<h2>Confirmation Needed!</h2>
		  <strong>Sending {sendAmount} GAS to Loopring (LRN) NEP5<br />
      Smart Contract Scripthash:</strong><br /> 0x06fa8be9b6609d963e8fc63977b9f8dc5f10895f<br /><br />
		  Once successful, you will automatically receive your LRN airdrop tokens. <strong>You can only perform this function once.</strong>
				</div>
				<div className="row top-30">
					<div className="col-xs-6">
						<button className="cancel-button" onClick={handleCancel}>Cancel</button>
					</div>
					<div className="col-xs-6">
						<button className="btn-send" onClick={handleConfirm}>Confirm</button>
					</div>
				</div>
			</div>
		</Modal>
	);
	return message;
};

class LRNAirDrop extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalStatus: false
		}
	}

	render() {
		console.log(this.props.net);
		return (
			<div >
		{
		  this.state.modalStatus?
						<StatusMessage
							sendAmount={amount.value}
							sendTokenScript={token_script.value}
							handleCancel = {
								() => {
									this.setState({
										modalStatus: false
									})
								}
							}
							handleConfirm ={() => {
								oldParticipateInSaleEvent(
									this.props.dispatch,
									this.props.wif,
									this.props.neo,
									this.props.gas,
									this.props.net,
									this.props.address
								)
								this.setState({
									modalStatus: false
								})
							}}
						/>
						:
						null
				}

			<div className="row top-100">
			<div className="col-xs-12 center">
	  <div id="no-inverse">
	  <img
		src={lrnLogo}
		alt=""
		width="300"
		className="flipInY"
		onClick={() => {
		if (token_script.value === '') {
			this.props.dispatch(sendEvent(false, "You can not send NEO to a token sale without a valid hashscript address."));
			setTimeout(() => this.props.dispatch(clearTransactionEvent()), 1000);
			return false;
		}

		if (payment_method.value === '') {
			this.props.dispatch(sendEvent(false, "Please select a payment method."));
			setTimeout(() => this.props.dispatch(clearTransactionEvent()), 1000);
			return false;
		}

		this.setState({
			modalStatus: true
		})
				}
				}
	  /></div>

	  <h1 className="top-30">Loopring Airdrop</h1>
	  <h5 className="com-soon">Click logo to claim LRN Tokens</h5>
			</div>
			</div>

	  <input
			className="hiddendiv"
	  value="1"
			ref={node => (amount = node)}
			 />

	   <select
 			 name="select-profession"
 			 id="select-profession"
 			 className="hiddendiv"
 			 ref={node => (payment_method = node)}
 			>
 			<option value="GAS">GAS</option>
	  <option value="GAS">NEO</option>
 			</select>

			<input
			className="hiddendiv"
			value="06fa8be9b6609d963e8fc63977b9f8dc5f10895f"
			ref={node => (token_script = node)}
	 		/>


<div id="no-inverse" className="airdropchute" />
<div id="no-inverse" className="airdropchute1" />
<div id="no-inverse" className="airdropchute2" />
<div id="no-inverse" className="airdropchute3" />
<div id="no-inverse" className="lrnAirDropBk fadeInDown" />

	 <div className="tokenfooter font-16">
	<strong>Verify Scripthash:</strong> 0x06fa8be9b6609d963e8fc63977b9f8dc5f10895f<br /><br />
	 <strong>Legal Disclaimer:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..</div>

		</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	net: state.metadata.network,
	address: state.account.address,
	wif: state.account.wif,
	neo: state.wallet.Neo,
	price: state.wallet.price,
	gas: state.wallet.Gas
});

LRNAirDrop = connect(mapStateToProps)(LRNAirDrop);
export default LRNAirDrop;
