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

let sendAddress,satPerByte,sendAmount;
let API_DOMAIN = "https://api.smartbit.com.au";
var bitcoin = require('bitcoinjs-lib');
var WAValidator = require("wallet-address-validator");

// var blocktrail = require('blocktrail-sdk');

var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

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

const validateForm = (dispatch, asset ,net) => {
    // check for valid address
    if (net == "MainNet") {
        var validMain = WAValidator.validate(sendAddress.value,"bitcoin");
        if(validMain) {
            return true;
        } else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        }
    } else {
        var validTest = WAValidator.validate(sendAddress.value,"bitcoin","testnet");
        if (validTest) {
            return true;
        } else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        }
    }
};

const getByteCountSegwitP2SH = (inputCount,outputCount,isMulti,m,n) => {
    var inputSize = isMulti ? ((73 * m) + (34 * n) + 6 + (76 * 4)) : 108 + (64 * 4)
    var outputSize = 34 * 4
    var estimatedWeight = inputSize * inputCount + outputSize * outputCount + 10 * 4
    return Math.ceil(estimatedWeight / 4)
}

const sweepKey = async (dispatch,wif,net) => {
	let DOUBLE_TX  = false;
	let NETWORK ;
    // let EXPLORER_DOMAIN = explorerDomain();
    // let Buffer = null
    wif = wif.trim();

    if (net === "MainNet") {
        NETWORK = bitcoin.networks.bitcoin;
    } else {
        NETWORK = bitcoin.networks.testnet
    }

    let send_address = sendAddress.value;
    if (validateForm(dispatch,send_address,net) === true) {
        console.log("create P2SHAddress");
        var keyPair = bitcoin.ECPair.fromWIF(wif,NETWORK);
        console.log("keyPair P2SHAddress" + JSON.stringify(keyPair))
		var pubKey = keyPair.getPublicKeyBuffer();
        console.log("pubKey P2SHAddress" + pubKey)
		var pubKeyHash = bitcoin.crypto.hash160(pubKey);
        console.log("pubKeyHash P2SHAddress" + pubKeyHash)
		var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
        console.log("redeemScript P2SHAddress" + redeemScript)
        var redeemScriptHash = bitcoin.crypto.hash160(redeemScript);
        console.log("redeemScriptHash P2SHAddress" + redeemScriptHash)
        var scriptPubKey = bitcoin.script.scriptHash.output.encode(redeemScriptHash);
        console.log("scriptPubKey P2SHAddress" + scriptPubKey)
        let P2SHAddress;
        P2SHAddress = bitcoin.address.fromOutputScript(scriptPubKey,NETWORK);
        console.log("create mainnet end P2SHAddress" + P2SHAddress)


        let response = await axios.get(API_DOMAIN+"/v1/blockchain/address/" + P2SHAddress + "/unspent");
        console.log("result.unspent " + JSON.stringify(response));

        let data = response.data.unspent.map(function (item) {
            return {
                "txid": item.txid,
                "vout": item.n,
                "satoshis": item.value_int
            }
        });

        keyPair = bitcoin.ECPair.fromWIF(wif,NETWORK);
        var inputData = JSON.stringify(data, null,2);
        console.log("inputData = " + inputData);
		inputData = JSON.parse(inputData);
        var toAddressObj = bitcoin.address.fromBase58Check(send_address);
        console.log("toAddressObj " + toAddressObj)

        let sat_per_byte = parseFloat(satPerByte.value);

        var pubKey = keyPair.getPublicKeyBuffer();
        console.log("second pubKey = " + pubKey);
        var pubKeyHash = bitcoin.crypto.hash160(pubKey);
        console.log("second pubKeyHash = " + pubKeyHash);
        var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
        console.log("second redeemScript = " + redeemScript);
        var redeemScriptHash = bitcoin.crypto.hash160(redeemScript);
        console.log("second redeemScriptHash = " + redeemScriptHash);
        var scriptPubKey = bitcoin.script.scriptHash.output.encode(redeemScriptHash);
        console.log("second scriptPubKey " + scriptPubKey)

        let txb = new bitcoin.TransactionBuilder(NETWORK);

        console.log("txb created = " + txb);
        for (var i = 0; i < inputData.length; i++) {
            txb.addInput(inputData[i].txid,
                inputData[i].vout,
                0xffffffff,
                scriptPubKey)
        }
        console.log("calculate tx size and fee ")
        //calculate tx size and fee
        var estimatedByteCount = getByteCountSegwitP2SH(inputData.length, 1)
        console.log("estimatedByteCount " + estimatedByteCount)
        var estimatedFeeSatoshis = Math.ceil(estimatedByteCount * sat_per_byte)
        console.log("estimatedFeeSatoshis " + estimatedFeeSatoshis)
        var totalSatoshis = inputData.reduce(function(total, item){return total += item.satoshis}, 0)
        console.log("estimatedFeeSatoshis " + totalSatoshis)
        var totalSatoshisMinusFee = totalSatoshis - estimatedFeeSatoshis
        console.log("estimatedFeeSatoshis " + totalSatoshisMinusFee)

        let sendToScriptPubkey;

        if (DOUBLE_TX) {
            if (NETWORK.scriptHash == toAddressObj.version) {
                alert("Can't double Transaction to P2SH, please send to P2PKH")
                return
            }
            sendToScriptPubkey = redeemScript
        } else if (NETWORK.pubKeyHash == toAddressObj.version) {
            sendToScriptPubkey = bitcoin.script.pubKeyHash.output.encode(toAddressObj.hash)
        } else if (NETWORK.scriptHash == toAddressObj.version) {
            sendToScriptPubkey = bitcoin.script.scriptHash.output.encode(toAddressObj.hash)
        }

        //add output
        txb.addOutput(sendToScriptPubkey,
            totalSatoshisMinusFee)

        //sign all inputs
        for (var i = 0; i < inputData.length; i++) {
            txb.sign(i, keyPair, redeemScript, null, inputData[i].satoshis)
        }

        var tx = txb.build()
        console.log("tx " + tx)
        var tx_txid = tx.getId()
        console.log("tx_txid " + tx_txid)
        var tx_raw = tx.toHex()
        console.log("tx_raw " + tx_raw)
        if (DOUBLE_TX) {
            var secondTxInput = {
                txid: tx_txid,
                vout: 0,
                satoshis: totalSatoshisMinusFee
            }
            var txb2 = new bitcoin.TransactionBuilder(NETWORK);
            var sendAmountMinusFees = secondTxInput.satoshis - Math.ceil(142 * sat_per_byte);
            if (secondTxInput.satoshis - Math.ceil(142 * sat_per_byte) < 0) {
                alert('Not enough funds to pay for Double TX fees.');
                return;
            }
            if (parseInt(sendAmountMinusFees / 2) < 546) {
                alert('Not enough funds to pay for Double TX fees. Would create dust.');
                return;
            }
            txb2.addInput(secondTxInput.txid,
                secondTxInput.vout,
                0xffffffff,
                redeemScript);
            txb2.tx.ins[0].prevOutType = bitcoin.script.types.P2WPKH;
            txb2.addOutput(sendToScriptPubkey,
                parseInt(sendAmountMinusFees / 2));
            txb2.addOutput(sendToScriptPubkey,
                parseInt(sendAmountMinusFees / 2));

            txb2.sign(0, keyPair, null, null, secondTxInput.satoshis);
            var tx2 = txb2.build();
            console.log("tx2 " + tx2)
            var tx2_txid = tx2.getId();
            console.log("tx2_txid " + tx2_txid)
            var tx2_raw = tx2.toHex();
            console.log("tx2_raw " + tx2_raw)

            setTimeout(() => sendPushTx(tx2_raw), 1500);

            console.log("Transaction sent!#2")

        }

        sendPushTx(tx_raw);
        dispatch(sendEvent(true, "Sweep Successful! Your BTC balance will be automatically updated when the blockchain has processed one or more confirmations. Your can view your BTC transaction history or your address online for more info."));
        setTimeout(() => dispatch(clearTransactionEvent()), 5000);
        return true;

	}
}

const sendPushTx = async (txraw) => {
    var config = {
        headers: {
            contentType: 'application/json',
            dataType: 'json'
        }
    }
	let tx_res = await axios.post(API_DOMAIN+"/v1/blockchain/pushtx",
		{hex: txraw},config);
	console.log("Transaction sent!" + JSON.stringify(tx_res));
}

const StatusMessage = ({ sendAmount, sendAddress, handleCancel, handleConfirm }) => {
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
                    <strong>Confirmation Needed.  Transfer all available BTC to {sendAddress}?</strong>
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

class SweepBitcoin extends Component {
    constructor(props) {
        super(props);
        if(!this.props.btcLoggedIn){
    			this.props.dispatch(btcLoginRedirect("/sendBTC"));
    			this.props.history.push("/newBitcoin");
    		};
        this.state = {
            modalStatus: false
        };
    }

	render() {
        const net = this.props.net;
        const wif = this.props.btcPrivKey;
		const dispatch = this.props.dispatch;

		console.log(this.props.net);
		return (
			<div>
                {
                    this.state.modalStatus?
                        <StatusMessage
                            sendAmount={satPerByte.value}
                            sendAddress={sendAddress.value}
                            handleCancel = {
                                () => {
                                    this.setState({
                                        modalStatus: false
                                    })
                                }
                            }
                            handleConfirm ={() => {
                                sweepKey(
                                    dispatch,
                                    wif,
                                    net
                                )
                                this.setState({
                                    modalStatus: false
                                })
                            }}
                        />
                        :
                        null
                }

				<div className=" dash-panel top-20">




        <div className="col-xs-12 center">
        <h2>Sweep Bitcoin from v0.0.56</h2>
        <p className="com-soon">Quickly transfer BTC from Morpheus v0.0.56 to your new address using this tool.</p>
        <div className="clearboth" />
          <hr className="dash-hr-wide top-20" />
        </div>

        <div className="clearboth" />
        <div id="sweepcont top-20">
        <div className="col-xs-3">
        <h4>BTC Private Key:</h4>
        </div>
        <div className="col-xs-9">
            <input
            className="form-send-white"
            id="wifprivatekey" placeholder={this.props.btcPrivKey}
            value={this.props.btcPrivKey}
            />
        </div>
        <div className="clearboth" />
        <div className="row  top-20" />
        <div className="col-xs-3">
        <h4>Deposit Address:</h4>
        </div>
        <div className="col-xs-9">
            <input
            placeholder={this.props.btcPubAddr}
            value={this.props.btcPubAddr}
              className="form-send-white"
              id="sendAddress"
              ref={node => {
              sendAddress = node;
              }}
            />
        </div>
        <div className="clearboth" />
        <div className="row  top-20" />
        <div className="col-xs-3">
        <h4>Miner Fee:</h4>
        </div>
        <div className="col-xs-2">
            <input type="number" className="form-send-white input-lg" id="satperbyte" min="10" max="40" placeholder="15" value="15" ref={node => {
                satPerByte = node;
            }}/><br />
            Satoshis/Byte
        </div>

        <div className="col-xs-3">
        <button
            className="btn-send"
            id="sweepkey"
            onClick={
                () => {
                    if (sendAddress.value === '') {
                        dispatch(sendEvent(false, "You can not send without address."));
                        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                        return false;
                    }


                    if (parseFloat(satPerByte.value) <= 0) {
                        dispatch(sendEvent(false, "You cannot sweep a negative amount of BTC."));
                        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                        return false;
                    }

                    this.setState({
                        modalStatus: true
                    })
                }
            }
        >
            Sweep BTC
        </button>
        </div>



        </div>

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

SweepBitcoin = connect(mapStateToProps)(SweepBitcoin);
export default SweepBitcoin;
