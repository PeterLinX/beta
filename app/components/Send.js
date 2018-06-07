import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress,getRPCEndpoint } from "neon-js";
import { rpc,api } from '@cityofzion/neon-js';
import Modal from "react-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import neoLogo from "../img/neo.png";
import Claim from "./Claim.js";
import Assets from "./Assets";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import NEOChart from "./NepCharts/NEOChart";

import Search from "./Search";
import TopBar from "./TopBar";
import {BIP44_PATH} from "../core/constants";

let sendAddress, sendAmount, confirmButton;
let encodeTransactionResponse='';
let signature =  undefined;
let signatureInfo = '';
let signedTransaction = '';
let sentTransactionInfo = '';
const neonJsApi = require( 'neon-js' );
const comm_node = require('ledger-node-js-api');

const apiURL = val => {
	return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};

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
        top: "100px",
        height: 260,
        width: 600,
        left: "100px",
        right: "100px",
        bottom: "100px",
        boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
    }
};

// form validators for input fields
const validateForm = (dispatch, neo_balance, gas_balance, asset) => {
	// check for valid address
	try {
		if (
			verifyAddress(sendAddress.value) !== true ||
      sendAddress.value.charAt(0) !== "A"
		) {
			dispatch(sendEvent(false, "The address you entered was not valid."));
			setTimeout(() => dispatch(clearTransactionEvent()), 1000);
			return false;
		}
	} catch (e) {
		dispatch(sendEvent(false, "The address you entered was not valid."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	}
	// check for fractional neo
	if (
		asset === "Neo" &&
    parseFloat(sendAmount.value) !== parseInt(sendAmount.value)
	) {
		dispatch(sendEvent(false, "You cannot send fractional amounts of Neo."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (asset === "Neo" && parseInt(sendAmount.value) > neo_balance) {
		// check for value greater than account balance
		dispatch(sendEvent(false, "You do not have enough NEO to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (asset === "Gas" && parseFloat(sendAmount.value) > gas_balance) {
		dispatch(sendEvent(false, "You do not have enough GAS to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (parseFloat(sendAmount.value) < 0) {
		// check for negative asset
		dispatch(sendEvent(false, "You cannot send negative amounts of an asset."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	}
	return true;
};

// open confirm pane and validate fields
const openAndValidate = (dispatch, neo_balance, gas_balance, asset) => {
	if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
		dispatch(togglePane("confirmPane"));
	}
};

const encodeTransactionAndcreateSignature = async(net,selfAddress,account,asset) => {
    let balance = await neonJsApi.getBalance( net, selfAddress );
    let balanceInfo = JSON.stringify( balance );
    console.log( "balance " + balanceInfo + "\n" );
    let assetId;
    if (asset === "Neo") {
        assetId = neonJsApi.neoId;
    } else {
        assetId = neonJsApi.gasId;
    }
		console.log( "assetId " + assetId + "\n" );
    const coinsData = {
        "assetid": assetId,
        "list": balance.unspent[asset],
        "balance": balance[asset],
        "name": asset
    };
		console.log(coinsData);
    let fromAccount = account;
    console.log("fromAccount = "+JSON.stringify(fromAccount))
	encodeTransactionResponse = neonJsApi.transferTransaction( coinsData, fromAccount._publicKey, sendAddress.value, sendAmount.value );
    console.log("encodeTransaction encodeTransactionResponse " + encodeTransactionResponse + "\n");

    // Create Signature
    let textToSign = encodeTransactionResponse + BIP44_PATH;
    signatureInfo = "Ledger Signing Text of Length [" + textToSign.length + "], Please Confirm Using the Device's Buttons. " + textToSign;

    console.log( signatureInfo + "\n" );
    var validStatus = [0x9000];

    var messages = [];

    let bufferSize = 255 * 2;
    let offset = 0;

    console.log("textToSign.length " + textToSign.length )

    while ( offset < textToSign.length ) {
        let chunk;
        let p1;
        if ( ( textToSign.length - offset ) > bufferSize ) {
            chunk = textToSign.substring( offset, offset + bufferSize );
        } else {
            chunk = textToSign.substring( offset );
        }
        if ( ( offset + chunk.length ) == textToSign.length ) {
            p1 = "80";
        } else {
            p1 = "00";
        }

        let chunkLength = chunk.length / 2;

        console.log( "Ledger Signature chunkLength " + chunkLength + "\n" );

        let chunkLengthHex = chunkLength.toString( 16 );
        while ( chunkLengthHex.length < 2 ) {
            chunkLengthHex = "0" + chunkLengthHex;
        }

        console.log( "Ledger Signature chunkLength hex " + chunkLengthHex + "\n" );

        messages.push( "8002" + p1.toString() + "00" + chunkLengthHex.toString() + chunk.toString() );
        offset += chunk.length;
    }

    await comm_node.create_async( 0, false ).then( function( comm ) {
        for ( let ix = 0; ix < messages.length; ix++ ) {
            let message = messages[ix];
            console.log( "Ledger Message (" + ix +
                "/" + messages.length +
                ") " + message + "\n" );

            comm.exchange( message, validStatus ).then( function( response ) {
                console.log( "Ledger Signature Response " + response + "\n" );
                if ( response != "9000" ) {
                    comm.device.close();

                    let rLenHex = response.substring( 6, 8 );
                    // process.stdout.write( "Ledger Signature rLenHex " + rLenHex + "\n" );
                    let rLen = parseInt( rLenHex, 16 ) * 2;
                    // process.stdout.write( "Ledger Signature rLen " + rLen + "\n" );
                    let rStart = 8;
                    // process.stdout.write( "Ledger Signature rStart " + rStart + "\n" );
                    let rEnd = rStart + rLen;
                    // process.stdout.write( "Ledger Signature rEnd " + rEnd + "\n" );

                    while ( ( response.substring( rStart, rStart + 2 ) == "00" ) && ( ( rEnd - rStart ) > 64 ) ) {
						rStart += 2;
                    }

                    let r = response.substring( rStart, rEnd );
                    console.log( "Ledger Signature R [" + rStart + "," + rEnd + "]:" + ( rEnd - rStart ) + " " + r + "\n" );
                    let sLenHex = response.substring( rEnd + 2, rEnd + 4 );
                    // process.stdout.write( "Ledger Signature sLenHex " + sLenHex + "\n" );
                    let sLen = parseInt( sLenHex, 16 ) * 2;
                    // process.stdout.write( "Ledger Signature sLen " + sLen + "\n" );
                    let sStart = rEnd + 4;
                    // process.stdout.write( "Ledger Signature sStart " + sStart + "\n" );
                    let sEnd = sStart + sLen;
                    // process.stdout.write( "Ledger Signature sEnd " + sEnd + "\n" );

                    while ( ( response.substring( sStart, sStart + 2 ) == "00" ) && ( ( sEnd - sStart ) > 64 ) ) {
						sStart += 2;
                    }

                    let s = response.substring( sStart, sEnd );
                    console.log( "Ledger Signature S [" + sStart + "," + sEnd + "]:" + ( sEnd - sStart ) + " " + s + "\n" );

                    let msgHashStart = sEnd + 4;
                    let msgHashEnd = msgHashStart + 64;
                    let msgHash = response.substring( msgHashStart, msgHashEnd );
                    console.log( "Ledger Signature msgHash [" + msgHashStart + "," + msgHashEnd + "] " + msgHash + "\n" );

                    signature = r + s;
                    signatureInfo = "Signature of Length [" + signature.length + "] : " + signature;
                    console.log( signatureInfo + "\n" );

                    //console.log( "Check Signature of Length [" + checkSignature.length + "] : " + checkSignature + "\n" );
                }
            } )
                .catch( function( reason ) {
                    comm.device.close();
                    signatureInfo = "An error occured[1]: " + reason;
                    console.log( "Signature Reponse " + signatureInfo + "\n" );
                    dispatch(sendEvent(false, "Transaction failed!"));
                    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                } );
        }
    } )
        .catch( function( reason ) {
            comm.device.close();
            signatureInfo = "An error occured[2]: " + reason;
            console.log( "Signature Reponse " + signatureInfo + "\n" );
            dispatch(sendEvent(false, "Transaction failed!"));
            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
        } );
}


const queryRPC = (net, method, params, id = 1) => {
    const jsonRequest = axios.create({
            headers: { 'Content-Type': 'application/json' }
        }),
        jsonRpcData = {
            method,
            params,
            id,
            jsonrpc: '2.0'
        };
    return getRPCEndpoint(net).then((rpcEndpoint) => {
        return jsonRequest.post(rpcEndpoint, jsonRpcData).then((response) => response.data);
    });
};

const signAndsendTransaction = async (dispatch , net, account) => {
	//Sign Transaction
	let fromAccount = account;
    signedTransaction = neonJsApi.addContract( encodeTransactionResponse, signature, fromAccount._publicKey );

    // Send Transaction
    console.log( "sendrawtransaction " + signedTransaction + "\n" );
    const endpoint = await api.neoscan.getRPCEndpoint(net);
    //let sentTransaction = await rpc.queryRPC( endpoint, "sendRawTransaction", [signedTransaction], 4 );
		dispatch(
        sendEvent(
            true,
            "Transaction signed on Ledger. Broadcasting to the blockchain. You will be notified once complete."
        )
    );

    setTimeout(() => dispatch(clearTransactionEvent()), 10000);

    let sentTransaction = await queryRPC( net, "sendrawtransaction", [signedTransaction], 4 )
    sentTransactionInfo = JSON.stringify( sentTransaction );
    console.log( "sentTransaction " + sentTransactionInfo + "\n" );
    dispatch(
        sendEvent(
            true,
            "Transaction Successful! Your balance will automatically update when the blockchain has processed it."
        )
    );

    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
}


// perform send transaction
const sendTransaction = async(
	dispatch,
	net,
	selfAddress,
	wif,
	asset,
	neo_balance,
	gas_balance,
  isHardwareLogin,
  account
) => {
	// validate fields again for good measure (might have changed?)
	if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
		dispatch(sendEvent(true, "Processing..."));
		log(net, "SEND", selfAddress, {
			to: sendAddress.value,
			asset: asset,
			amount: sendAmount.value
		});
		if (isHardwareLogin === false) {
            doSendAsset(net, sendAddress.value, wif, asset, sendAmount.value)
                .then(response => {
                    if (response.result === undefined || response.result === false) {
						dispatch(sendEvent(false, "Transaction failed!"));
                    } else {
						dispatch(
						sendEvent(
						    true,
						    "Transaction complete! Your balance will automatically update when the blockchain has processed it."
						)
						);
                    }
                    setTimeout(() => dispatch(clearTransactionEvent()), 3000);
                })
                .catch(e => {
                    dispatch(sendEvent(false, "Transaction failed!"));
                    setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                });
		} else {
			// Send transaction using Ledger
			// Get balance
			// Sign Transaction
            dispatch(
                sendEvent(
                    true,
                    "Transaction complete! Your balance will automatically update when the blockchain has processed it."
                )
            );

        setTimeout(() => dispatch(clearTransactionEvent()), 3000);
		}

	}
	// close confirm pane and clear fields
	dispatch(togglePane("confirmPane"));
	sendAddress.value = "";
	sendAmount.value = "";
	confirmButton.blur();
};

const StatusMessage = ({ sendAmount, sendAddress, handleCancel, handleConfirm, asset }) => {
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
					<strong>Confirm sending {sendAmount} {asset} to {sendAddress} by selecting Sign Tx on your Ledger Nano S.</strong>
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

class Send extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			gas: 0,
			neo: 0,
			neo_usd: 0,
			gas_usd: 0,
			value: 0,
			inputEnabled: true,
            modalStatus: false
		};
		this.handleChangeNeo = this.handleChangeNeo.bind(this);
		this.handleChangeGas = this.handleChangeGas.bind(this);
		this.handleChangeUSD = this.handleChangeUSD.bind(this);

	}

	async componentDidMount() {
		let neo = await axios.get(apiURL("NEO"));
		let gas = await axios.get(apiURL("GAS"));
		neo = neo.data.USD;
		gas = gas.data.USD;
		this.setState({ neo: neo, gas: gas });
	}

	handleChangeNeo(event) {
		this.setState({ value: event.target.value }, (sendAmount = value));
		const value = event.target.value * this.state.neo;
		this.setState({ neo_usd: value });
	}

	handleChangeGas(event) {
		this.setState({ value: event.target.value }, (sendAmount = value));
		const value = event.target.value * this.state.gas;
		this.setState({ gas_usd: value });
	}

	async handleChangeUSD(event) {
		this.setState({ gas_usd: event.target.value });

		let gas = await axios.get(apiURL("GAS"));
		gas = gas.data.USD;
		this.setState({ gas: gas });
		console.log("done");
		const value = this.state.gas_usd / this.state.gas;
		this.setState({ value: value }, (sendAmount = value));
	}

	render() {
		const {
			dispatch,
			wif,
			address,
			status,
			neo,
			gas,
			net,
			confirmPane,
			selectedAsset,
      isHardwareLogin,
			account
		} = this.props;
		let confirmPaneClosed;
		let open = true;
		if (confirmPane) {
			confirmPaneClosed = "100%";
			open = true;
		} else {
			open = false;
			confirmPaneClosed = "69%";
		}

		let btnClass;
		let formClass;
		let priceUSD = 0;
		let gasEnabled = false;
		let inputEnabled = true;
		let convertFunction = this.handleChangeNeo;
		if (selectedAsset === "Neo") {
			btnClass = "btn-send";
			convertFunction = this.handleChangeNeo;
			formClass = "form-send-neo";
			priceUSD = this.state.neo_usd;
			inputEnabled = true;
		} else if (selectedAsset === "Gas") {
			gasEnabled = true;
			inputEnabled = false;
			btnClass = "btn-send-gas";
			formClass = "form-send-gas";
			priceUSD = this.state.gas_usd;
			convertFunction = this.handleChangeGas;
		}
		return this.props.isHardwareLogin?(
			<div>
			<div className="breadBar">
			<div className="col-flat-10">
			<ol id="no-inverse" className="breadcrumb">
			</ol>
			</div>
			<div className="col-flat-2">
			<Search />
			</div>
			</div>
			<TopBar />
                {
                    this.state.modalStatus?
						<StatusMessage
							sendAmount={sendAmount.value}
							sendAddress={sendAddress.value}
							handleCancel = {
				() => {
				    this.setState({
				        modalStatus: false
				    })
				}
                            }
							handleConfirm ={() => {
								signAndsendTransaction(dispatch, net,account);
				this.setState({
				    modalStatus: false
				})
                            }}
							asset = {selectedAsset}
						/>
                        :
                        null
                }

		<div id="send">
					<div className="row dash-panel">


					<div className="col-xs-5">
						<img
							src={neoLogo}
							alt=""
							width="38"
							className="neo-logo fadeInDown"
						/>
						<h2>Send {selectedAsset}</h2>
						<p className="com-soon">NEO has two native tokens, NEO and GAS. NEO, with a total of 100 million tokens, represents the right to manage the network. You cannot send a fraction of a NEO. The minimum unit of GAS is 0.00000001.</p>
					</div>

					<div className="col-xs-7 center">
					<NEOChart />
					</div>

					<div className="clearboth" />

					<div className="top-20">
						<div className="col-xs-9">
					<input
						className={formClass}
						id="center"
						placeholder="Enter a valid NEO public address here"
						ref={node => {
						sendAddress = node;
						}}
					/>
					</div>

					<div className="col-xs-3">
					<div id="no-inverse">
					<div
						id="sendAsset"
						className={btnClass}
						style={{ width: "100%" }}
						data-tip
						data-for="assetTip"
						onClick={() => {
						this.setState({ gas_usd: 0, neo_usd: 0,  value: 0 });
						document.getElementById("assetAmount").value = "";
						dispatch(toggleAsset());
						}}
					>
						{selectedAsset}
					</div>
					</div>
					</div>

					<div className="col-xs-5  top-20">
						<input
							className={formClass}
							type="number"
							id="assetAmount"
							min="1"
							onChange={convertFunction}
							value={this.state.value}
							placeholder="Enter amount to send"
							ref={node => {
								sendAmount = node;
							}}
						/>
						<div className="clearboth"/>
						<span className="com-soon block top-10">Amount in NEO/GAS to send</span>
					</div>
					<div className="col-xs-4 top-20">
						<input
							className={formClass}
							id="sendAmount"
							onChange={this.handleChangeUSD}
							onClick={this.handleChangeUSD}
							disabled={gasEnabled === false ? true : false}
							placeholder="Amount in US"
							value={`${priceUSD}`}
						/>
						<label className="amount-dollar">$</label>
						<div className="clearboth"/>
						<span className="com-soon block top-10">Calculated in USD</span>
					</div>

					<div className="col-xs-3 top-20">
						<button
							className="grey-button"
							onClick={
								()=>{
				    if (sendAddress.value === '') {
				        dispatch(sendEvent(false, "You can not send without address."));
				        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
				        return false;
				    }


				    if (parseFloat(sendAmount.value) <= 0) {
				        dispatch(sendEvent(false, "You cannot send negative amounts."));
				        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
				        return false;
				    }

				    encodeTransactionAndcreateSignature(net,address,account,selectedAsset)

				    this.setState({
				        modalStatus: true
				    })
				}
							}
						>
							Send
						</button>

					</div>
				</div>
				</div>
				</div>
				<div className="hiddendiv">
				<input className="form-send-white" value={encodeTransactionResponse} />
				<input className="form-send-white" value={signatureInfo} />
				<input className="form-send-white" value={signedTransaction} />
				<input className="form-send-white" value={sentTransactionInfo} />
				</div>
				<div className="send-notice">
					<p>
						All NEO and GAS transactions are FREE. Only send NEO or GAS to a valid NEO address. Sending NEO/GAS to an address other than a valid NEO address can result in your NEO/GAS being lost. You cannot send a fraction of a NEO. Please double check address and amount before sending.
					</p>

				</div>
			</div>
		):(
			<div>

			<div className="breadBar">
			<div className="col-flat-10">
			<ol id="no-inverse" className="breadcrumb">
			</ol>
			</div>

			<div className="col-flat-2">
			<Search />
			</div>
			</div>

		<TopBar />
				<div id="send">

					<div className="row dash-panel">
						<div className="col-xs-5">
							<img
								src={neoLogo}
								alt=""
								width="38"
								className="neo-logo fadeInDown"
							/>
							<h2>Send {selectedAsset}</h2>
							<p className="com-soon">NEO has two native tokens, NEO and GAS. NEO, with a total of 100 million tokens, represents the right to manage the network. You cannot send a fraction of a NEO. The minimum unit of GAS is 0.00000001.</p>
						</div>

						<div className="col-xs-7 center">
						<NEOChart />
						</div>

						<div className="clearboth" />

						<div className="top-20">
							<div className="col-xs-9">
								<input
									className={formClass}
									id="center"
									placeholder="Enter a valid NEO public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">
							<div id="no-inverse">
								<div
									id="sendAsset"
									className={btnClass}
									style={{ width: "100%" }}
									data-tip
									data-for="assetTip"
									onClick={() => {
										this.setState({ gas_usd: 0, neo_usd: 0,  value: 0 });
										document.getElementById("assetAmount").value = "";
										dispatch(toggleAsset());
									}}
								>
									{selectedAsset}
								</div>
								</div>
								<ReactTooltip
									className="solidTip"
									id="assetTip"
									place="top"
									type="dark"
									effect="solid"
								>
									<span>Click to switch between NEO and GAS</span>
								</ReactTooltip>
							</div>

							<div className="col-xs-5  top-20">
								<input
									className={formClass}
									type="number"
									id="assetAmount"
									min="1"
									onChange={convertFunction}
									value={this.state.value}
									placeholder="Enter amount to send"
									ref={node => {
										sendAmount = node;
									}}
								/>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Amount in NEO/GAS to send</span>
							</div>
							<div className="col-xs-4 top-20">
								<input
									className={formClass}
									id="sendAmount"
									onChange={this.handleChangeUSD}
									onClick={this.handleChangeUSD}
									disabled={gasEnabled === false ? true : false}
									placeholder="Amount in US"
									value={`${priceUSD}`}
								/>
								<label className="amount-dollar">$</label>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Calculated in USD</span>
							</div>
							<div className="col-xs-3 top-20">
								<div id="sendAddress">
									<button
										className="grey-button"
										onClick={() =>
											sendTransaction(
												dispatch,
												net,
												address,
												wif,
												selectedAsset,
												neo,
												gas,
						            isHardwareLogin,
						            account
											)
										}
										ref={node => {
											confirmButton = node;
										}}
									>
										<span className="glyphicon glyphicon-send marg-right-5"/>  Send
									</button>
								</div>
							</div>

						</div>
					</div>

					<div className="send-notice">
						<p>
              All NEO and GAS transactions are FREE. Only send NEO or GAS to a valid NEO address. Sending NEO/GAS to an address other than a valid NEO address can result in your NEO/GAS being lost.  Please double check address and amount before sending.
						</p>

					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	wif: state.account.wif,
	address: state.account.address,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	isHardwareLogin: state.account.isHardwareLogin,
	account: state.account.account
});

Send = connect(mapStateToProps)(Send);
export default Send;
