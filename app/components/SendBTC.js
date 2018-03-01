import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Modal from "react-bootstrap-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import btcLogo from "../img/btc-logo.png";
import Assets from "./Assets";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import { btcLoginRedirect } from '../modules/account';

var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require("coinkey")


//var sleep = require("sleep");
//var regtestUtils = require("../modules/_regtest");
//var bitcoinTransaction = require("bitcoin-transaction");

let sendAddress, sendAmount, confirmButton ,dest;

const apiURL = val => {
	return "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
};

const getUnspentOutputsForBtc = async (net,address) =>{
    let base;
    if(net === "MainNet") {
        base = "https://blockexplorer.com/api/addr/"+address+"/utxo";
    }	else {
        base = "https://testnet.blockexplorer.com/api/addr/"+address+"/utxo";
    }

    var response = await axios.get(base);
    console.log(response.data);
    return response.data;
        // .then(function (response) {
        //  	console.log("response:" + JSON.stringify(response.data));
        //
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
};



// form validators for input fields
const validateForm = (dispatch, asset ,net) => {
    // check for valid address
	if (net == "MainNet") {
		var validMain = WAValidator.validate(sendAddress.value,"bitcoin");
		if(validMain) {
			 return true;
		} else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
            return false;
		}
	} else {
        var validTest = WAValidator.validate(sendAddress.value,"bitcoin","testnet");
        if (validTest) {
        	return true;
		} else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
            return false;
        }
	}
};

// open confirm pane and validate fields
const openAndValidate = (dispatch, neo_balance, gas_balance, asset) => {
	if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
		dispatch(togglePane("confirmPane"));
	}
};


function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime()-start) > milliseconds) {
			break;
		}
	}
}

// function logAddr(addr) {
//     dest = addr;
//     log("Generated new address " + dest.address)
// }
//
// function newTransaction(net) {
//     var newtx = {
//         "inputs": [{"addresses": [source.address]}],
//         "outputs": [{"addresses": [dest.address], "value": 25000}]
//     }
//
//     let rootUrl;
//     if (net === "MainNet"){
//         rootUrl = "https://api.blockcypher.com/v1/btc/main";
// 	} else {
// 		rootUrl = "https://api.blockcypher.com/v1/btc/test3";
// 	}
//     return $.post(rootUrl+"/txs/new", JSON.stringify(newtx));
// }
//
// function signAndSend(newtx) {
//     if (checkError(newtx)) return;
//
//     newtx.pubkeys     = [];
//     newtx.signatures  = newtx.tosign.map(function(tosign) {
//         newtx.pubkeys.push(source.public);
//         return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
//     });
//
//     let rootUrl;
//     if (net === "MainNet"){
//         rootUrl = "https://api.blockcypher.com/v1/btc/main";
//     } else {
//         rootUrl = "https://api.blockcypher.com/v1/btc/test3";
//     }
//     return $.post(rootUrl+"/txs/send", JSON.stringify(newtx));
// }
//
// function waitForConfirmation(finaltx) {
//     if (checkError(finaltx)) return;
//     log("Transaction " + finaltx.tx.hash + " to " + dest.address + " of " +
//         finaltx.tx.outputs[0].value/100000000 + " BTC sent.");
//
//     var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/test3");
//
//     // We keep pinging on a timer to keep the websocket alive
//     var ping = pinger(ws);
//
//     ws.onmessage = function (event) {
//         if (JSON.parse(event.data).confirmations > 0) {
//             log("Transaction confirmed.");
//             ping.stop();
//             ws.close();
//         }
//     }
//     ws.onopen = function(event) {
//         ws.send(JSON.stringify({filter: "event=new-block-tx&hash="+finaltx.tx.hash}));
//     }
//     console.log("Waiting for confirmation... (may take > 10 min)")
// }
//
// function checkError(msg) {
//     if (msg.errors && msg.errors.length) {
//         log("Errors occured!!/n" + msg.errors.join("/n"));
//         return true;
//     }
// }

// function pinger(ws) {
//     var timer = setInterval(function() {
//         if (ws.readyState == 1) {
//             ws.send(JSON.stringify({event: "ping"}));
//         }
//     }, 5000);
//     return {stop: function() { clearInterval(timer); }};
// }



// perform send transaction
const sendTransaction = async (
	dispatch,
	net,
	selfAddress,
	wif,
	asset,
	neo_balance,
	gas_balance,
	btc_balance
) => {
	// validate fields again for good measure (might have changed?)
	if (validateForm(dispatch, asset ,net) === true) {
        //dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress.value,
            asset: asset,
            amount: sendAmount.value
        });
        console.log("Display btc balance\n");
        console.log(btc_balance);
        //Send bitcoin
        let unspents = await getUnspentOutputsForBtc(net, selfAddress);

        console.log("unspent: " + JSON.stringify(unspents));
        let send_amount = parseFloat(sendAmount.value);
        let loop_amount = send_amount;

        if (btc_balance <= 0) {
            dispatch(sendEvent(false, "There is not balance for BTC."));
        } else if (btc_balance < sendAmount.value) {
            dispatch(sendEvent(false, "The BTC balance is less than the send amount."));
        } else {
            let i = 0;
            let new_base,send_base;
            let satoshi_amount = parseInt(send_amount * 100000000)
			// if (net === "MainNet") {
             //    var bcapi = new bcypher("btc","main","9ba58edd979a467a96f361a45b040b75")
			// } else {
             //    var bcapi = new bcypher("btc","test","9ba58edd979a467a96f361a45b040b75")
			// }
            //
			// bcapi.sendTX()
			console.log("wif ="+wif);
            var ck = CoinKey.fromWif(wif);
            var privateKey = ck.privateKey.toString('hex');
			console.log("hex private key = "+privateKey);
            var keys    = new bitcoin.ECPair(bigi.fromHex(privateKey));
            console.log("keys ="+keys);
			let token = "9ba58edd979a467a96f361a45b040b75";
			var newtx = {
                inputs: [{addresses: [selfAddress]}],
                outputs: [{addresses: [sendAddress.value], value: satoshi_amount}]
			};

            if(net === "MainNet") {
            	new_base = "https://api.blockcypher.com/v1/btc/main/txs/new?token=" + token;
                send_base = "https://api.blockcypher.com/v1/btc/main/txs/send?token=" + token;
			} else {
                new_base = "https://api.blockcypher.com/v1/btc/test3/txs/new?token="+token;
                send_base = "https://api.blockcypher.com/v1/btc/test3/txs/send?token="+token;
			}



			 axios.post(new_base,newtx)
				.then(function (tmptx) {
					console.log("create new transaction= "+JSON.stringify(tmptx));
					var sendtx = {
						tx: tmptx.data.tx
					}
                    sendtx.pubkeys = [];
                    sendtx.signatures = tmptx.data.tosign.map(function(tosign, n) {
                        sendtx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                        return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");

                	});

                     axios.post(send_base, sendtx).then(function(finaltx) {
                        console.log("finaltx= "+ finaltx);
                    })
                });
            // var guid = "7406150b-d7cd-43d1-9abf-91c5962edc74";
            // var fromaddress = selfAddress;
            // var toaddress = sendAddress.value;
            // var main_password = "";
            // var second_password = "";
            // var url = "http://localhost:3000/merchant/" + guid + "/payment?password=" + main_password + "&second_password=" + second_password
            //     + "&to=" + toaddress + "&amount=" + sendAmount.value + "&from=" + fromaddress;
            // var response = await axios.get(url);
            // console.log(JSON.stringify(response.data));
        }
    }
            // var from = selfAddress;
            // var to = sendAddress.value;
            // var privKeyWIF = wif;


            // var key   = new bitcoin.ECKey(bigi.fromHex(source.private), true);
			// dest  = null;
            // let rootUrl;
            // if (net === "MainNet"){
            //     rootUrl = "https://api.blockcypher.com/v1/btc/main";
            // } else {
            //     rootUrl = "https://api.blockcypher.com/v1/btc/test3";
            // }


            //await axios.post(rootUrl+"/addrs")
                // .then(logAddr)
                // .then(newTransaction)
                // .then(signAndSend)
                // .then(waitForConfirmation);




            // if (net == "MainNet") {
             //    bitcoinTransaction.getBalance(from, { network: "mainnet" }).then((balanceInBTC) => {
             //        return bitcoinTransaction.sendTransaction({
             //            from: from,
             //            to: to,
             //            privKeyWIF: privKeyWIF,
             //            btc: parseFloat(sendAmount.value),
             //            network: "testnet"
             //        });
             //    });
			// } else {
             //    bitcoinTransaction.getBalance(from, { network: "testnet" }).then((balanceInBTC) => {
             //        return bitcoinTransaction.sendTransaction({
             //            from: from,
             //            to: to,
             //            privKeyWIF: privKeyWIF,
             //            btc: parseFloat(sendAmount.value),
             //            network: "testnet"
             //        });
             //    });
             //    console.log("OK");
			// }
            // if (net == "MainNet") {
            //     var alice = bitcoin.ECPair.fromWIF(wif);
            //     var txb = new bitcoin.TransactionBuilder();
            //     unspents.forEach(function (item) {
            //         if(loop_amount>0){
            //             console.log("index:" + i.toString() + "\n");
            //             txb.addInput(item.txid ,i);
            //             if (loop_amount>item.amount){
            //                 txb.addOutput(sendAddress.value,parseFloat(item.amount)*100000000);
            //                 loop_amount = loop_amount - parseFloat(item.amount);
            //                 let output = parseFloat(item.amount);
            //                 console.log("output amount " + output.toString());
            //             } else {
            //                 txb.addOutput(sendAddress.value,parseFloat(loop_amount)*10000000);
            //             }
            //             txb.sign(i,alice);
            //             i = i + 1;
            //         }
            //     });
            // } else {
				// console.log("SendBTC Test Net.")
				// console.log("WIF= "+wif);
				// console.log("bitcoin network testnet= "+bitcoin.networks.testnet);
            //     var alice = bitcoin.ECPair.fromWIF(wif , bitcoin.networks.testnet);
				// console.log("alice = ", alice);
            //     var txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
            //     console.log("txb = ", txb);
            //     for (let i = 0; i < unspents.length; i++) {
            //         if (loop_amount > 0) {
            //         	console.log( "txid = " + unspents[i].txid + " : amount = " + unspents[i].amount );
            //             txb.addInput(unspents[i].txid, i);
            //             if (loop_amount > unspents[i].amount) {
            //                 txb.addOutput(sendAddress.value, parseInt(parseFloat(unspents[i].amount) * 100000000));
            //                 loop_amount = loop_amount - parseFloat(unspents[i].amount);
            //                 console.log("loop amount = " + loop_amount);
            //             } else {
            //                 txb.addOutput(sendAddress.value, parseInt(parseFloat(loop_amount) * 10000000));
            //             }
            //
            //         }
            //     }
            //     console.log("sign before");
            //     txb.sign(0, alice);
            //     txb.sign(1, alice);
            //     console.log("broad cast before");
            //     regtestUtils.broadcast(txb.build().toHex(), function () {
				// 	console.log("done");
            //     });
            //     console.log("broad cast after");
            // }

			// dispatch(
            // sendEvent(
			// 		false,
			// 		"Transaction complete! Your balance will automatically update when the blockchain has processed it."
			// 	)
			// );
		//}


		// doSendAsset(net, sendAddress.value, wif, asset, sendAmount.value)
		// 	.then(response => {
		// 		if (response.result === undefined || response.result === false) {
		// 			dispatch(sendEvent(false, "Transaction failed!"));
		// 		} else {
		// 			dispatch(
		// 				sendEvent(
		// 					true,
		// 					"Transaction complete! Your balance will automatically update when the blockchain has processed it."
		// 				)
		// 			);
		// 		}
		// 		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		// 	})
		// 	.catch(e => {
		// 		dispatch(sendEvent(false, "Transaction failed!"));
		// 		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		// 	});
	//}
	// close confirm pane and clear fields
	dispatch(togglePane("confirmPane"));
	sendAddress.value = "";
	sendAmount.value = "";
	confirmButton.blur();
};

class SendBTC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			gas: 0,
			neo: 0,
			neo_usd: 0,
			gas_usd: 0,
			value: 0,
			inputEnabled: true
		};
		this.handleChangeNeo = this.handleChangeNeo.bind(this);
		this.handleChangeGas = this.handleChangeGas.bind(this);
		this.handleChangeUSD = this.handleChangeUSD.bind(this);

		if(!this.props.btcLoggedIn){
			this.props.dispatch(btcLoginRedirect("/sendBTC"));
			this.props.history.push("/newBitcoin");
		}
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
      btc_address,
      btc_prvkey,
			status,
			neo,
			gas,
			net,
			confirmPane,
			selectedAsset,
			btc
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
			formClass = "form-send-btc";
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
		return (
			<div>
				<Assets />
				<div id="send">

					<div className="row dash-chart-panel">
						<div className="col-xs-9">
							<img
								src={btcLogo}
								alt=""
								width="45"
								className="neo-logo fadeInDown"
							/>
							<h2>Send Bitcoin (BTC)</h2>
						</div>

						<div className="col-xs-3 center">

						</div>

						<div className="col-xs-12 center">
							<hr className="dash-hr-wide top-20" />
						</div>

						<div className="clearboth" />

						<div className="top-20">
							<div className="col-xs-9">
								<input
									className={formClass}
									id="center"
									placeholder="Enter a valid BTC public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">

							<Link to={ "/receiveBitcoin" }>
								<button className="btc-button com-soon" >
									<span className="glyphicon glyphicon-qrcode marg-right-5"/>  Receive
								</button></Link>

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
								<span className="com-soon block top-10">Amount in BTC to send</span>
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
										className="btc-button"
										onClick={() =>
											sendTransaction(
												dispatch,
												net,
												btc_address,
                        btc_prvkey,
												selectedAsset,
												neo,
												gas,
												this.props.btc
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
              Your BTC address can be used to receive Bitcoin ONLY. Sending funds other than Bitcoin (BTC) to this address may result in your funds being lost.
						</p>
						<div className="col-xs-2 top-20"/>
						<div className="col-xs-8 top-20">
							<p className="center donations"
								data-tip
								data-for="donateTip"
								onClick={() => clipboard.writeText("17mE9Y7ERqpn6oUn5TEteNrnEmmXUsQw76")}
							>Morpheus Dev Team: 17mE9Y7ERqpn6oUn5TEteNrnEmmXUsQw76</p>
							<ReactTooltip
								className="solidTip"
								id="donateTip"
								place="top"
								type="light"
								effect="solid"
							>
								<span>Copy address to send donation</span>
							</ReactTooltip>
						</div>
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
	btc_address: state.account.btcPubAddr,
	btc_prvkey: state.account.btcPrivKey,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	btc: state.wallet.Btc,
	marketBTCPrice: state.wallet.marketBTCPrice,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
});

SendBTC = connect(mapStateToProps)(SendBTC);
export default SendBTC;
