import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Modal from "react-bootstrap-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import ltcLogo from "../img/litecoin.png";
import Assets from "./Assets";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { ltcLoginRedirect } from '../modules/account';

var bitcoin = require("bitcoinjs-lib");
//var WAValidator = require("wallet-address-validator");
let sendAddress, sendAmount, confirmButton;

const apiURL = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD";
};

const getUnspentOutputsForBtc = (net,address) =>{
    let base;
    if(net == "MainNet") {
        base = "https://blockexplorer.com/api/addr/"+address+"/utxo";
    }	else {
        base = "https://testnet.blockexplorer.com/api/addr/"+address+"/utxo";
    }

    axios.get(base)
        .then(function (response) {
            console.log(response);
            return response
        })
        .catch(function (error) {
            console.log(error);
            return []
        });
};

const getBtcTransactions = (net,address) =>{
    let base;
    let transactions = []
    if(net == "MainNet") {
        base = "https://blockexplorer.com/api/txs/?address="+address;
    }	else {
        base = "https://testnet.blockexplorer.com/api/txs/?address="+address;
    }

    axios.get(base)
        .then(function (response) {
            console.log(response);
            let txs = response.txs;
            let dict_item;
            txs.forEach(function (item) {
                dict_item = {
                    txid:item.txid,
                    type:"LTC",
                    amount:item.vout.value
                }

                transactions.add(dict_item);
            });

            return transactions;
        })
        .catch(function (error) {
            console.log(error);
            return transactions
        });
};
// form validators for input fields
const validateForm = (dispatch, asset, net) => {
    // check for valid address
    if (net == "MainNet") {
        var validMain = WAValidator.validate(sendAddress.value,"litecoin");
        if (validMain) {
            return true;
        } else {
            dispatch(sendEvent(false, "The address you entered was not valid."));
            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
            return false;
        }
    } else {
        var validTest = WAValidator.validate(sendAddress.value,"litecoin","testnet");
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

// perform send transaction
const sendTransaction = (
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
        dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress.value,
            asset: asset,
            amount: sendAmount.value
        });

        //Send bitcoin
        let unspents = getUnspentOutputsForBtc(net,selfAddress);
        let send_amount = parseFloat(sendAmount.value);
        let loop_amount = send_amount;

        if (btc_balance <= 0) {
            dispatch(sendEvent(false,"There is not balance for LTC."));
        } else if (btc_balance <  sendAmount.value) {
            dispatch(sendEvent(false,"The LTC balance is less than the send amount."));
        } else {
            let i = 0;
            var alice = bitcoin.ECPair.fromWIF(wif);
            var txb = new bitcoin.TransactionBuilder();
            unspents.forEach(function (item) {
                if(loop_amount>0){
                    txb.addInput(item.txid ,i);
                    if (loop_amount>item.amount){
                        txb.addOutput(sendAddress.value,parseFloat(item.amount)*100000000);
                        loop_amount = loop_amount - parseFloat(item.amount);
                    } else {
                        txb.addOutput(sendAddress.value,parseFloat(loop_amount)*10000000);
                    }
                    txb.sign(i,alice);
                    i = i + 1;
                }
            });

            dispatch(
                sendEvent(
                    true,
                    "Transaction complete! Your balance will automatically update when the blockchain has processed it."
                )
            );
        }


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
    }
    // close confirm pane and clear fields
    dispatch(togglePane("confirmPane"));
    sendAddress.value = "";
    sendAmount.value = "";
    confirmButton.blur();
};

class SendLTC extends Component {
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

        if(!this.props.ltcLoggedIn){
            this.props.dispatch(ltcLoginRedirect("/sendLTC"));
            this.props.history.push("/newLitecoin");
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
    ltcLoggedIntState({ value: event.target.value }, (sendAmount = value));
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
                        <div className="col-xs-8">
                            <img
                                src={ltcLogo}
                                alt=""
                                width="45"
                                className="neo-logo fadeInDown"
                            />
                            <h2>Send Bitcoin (LTC)</h2>
                        </div>

                        <div className="col-xs-4 center">
                            <Link to={ "/receiveBitcoin" }><div
                                className="grey-button"
                            >
                                <span className="glyphicon glyphicon-bitcoin marg-right-5"/>  View LTC Address
                            </div>
                            </Link>
                        </div>

                        <div className="col-xs-12 center">
                            <hr className="dash-hr-wide top-20" />
                        </div>

                        <div className="clearboth" />

                        <div className="top-20">
                            <div className="col-xs-12">
                                <input
                                    className={formClass}
                                    id="center"
                                    placeholder="Enter a valid LTC public address here"
                                    ref={node => {
                                        sendAddress = node;
                                    }}
                                />
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
                                <span className="com-soon block top-10">Amount in LTC to send</span>
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
                                        className="ltc-button"
                                        onClick={() =>
                                            sendTransaction(
                                                dispatch,
                                                net,
                                                address,
                                                wif,
                                                selectedAsset,
                                                neo,
                                                gas,
                                                this.props.ltc
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
                            Your LTC address can be used to receive Litecoin ONLY. Sending funds other than Litecoin (LTC) to this address may result in your funds being lost.
                        </p>
                        <div className="col-xs-2 top-20"/>
                        <div className="col-xs-8 top-20">
                            <p className="center donations"
                               data-tip
                               data-for="donateTip"
                               onClick={() => clipboard.writeText("LhN4Y7QiYpefjyGHp8Fz4Jn9UoRiEf5VQs")}
                            >Morpheus Dev Team: LhN4Y7QiYpefjyGHp8Fz4Jn9UoRiEf5VQs</p>
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
    net: state.metadata.network,
    neo: state.wallet.Neo,
    gas: state.wallet.Gas,
    btc: state.wallet.Btc,
    marketBTCPrice: state.wallet.marketBTCPrice,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
		ltcLoggedIn: state.account.ltcLoggedIn,
		ltcPrivKey: state.account.ltcPrivKey,
		ltcPubAddr: state.account.ltcPubAddr
});

SendLTC = connect(mapStateToProps)(SendLTC);

export default SendLTC;
