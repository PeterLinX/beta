import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
//import Modal from "react-bootstrap-modal";
import Modal from "react-modal";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import ethLogo  from "../img/eth.png";
import TransactionHistoryETH  from "./TransactionHistoryETH";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { etcLoginRedirect } from '../modules/account';
import {BLOCK_TOKEN} from "../core/constants";
import numeral from "numeral";
import { block_index} from "../components/NetworkSwitch";
import { ethLoginRedirect } from "../modules/account";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import ETHChart from "./NepCharts/ETHChart";
import ETHQRModalButton from "./ETHQRModalButton.js";


var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require('coinkey');
var ethereum_address = require("ethereum-address");

let sendAddress, sendAmount, confirmButton, inputSendAddress;

const refreshBalance = (dispatch, net, address ,btc ,ltc ,eth) => {
  initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth).then(response => {
    dispatch(sendEvent(true, "Prices and balances updated."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
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

const apiURL = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
};

const apiURLFor = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym="+val+"&tsyms=USD";
};
// form validators for input fields

// form validators for input fields
const validateForm = (dispatch) => {
    sendAddress = inputSendAddress.value.substring(2);
    console.log("sendAddress = " + sendAddress)
    if (ethereum_address.isAddress(sendAddress)) {
        console.log('Valid ethereum address.');
        return true;
    }
    else {
        console.log('Invalid Ethereum address.');
        dispatch(sendEvent(false, "The address you entered was not valid."));
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        return false;
    }
}

const sendTransaction = (
    dispatch,
    net,
    selfAddress,
    prvKey,
    asset,
    neo_balance,
    gas_balance,
    eth_balance
) => {
    sendAddress = inputSendAddress.value.substring(2);
    if (validateForm(dispatch) === true) {
        dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress,
            asset: asset,
            amount: sendAmount.value
        });

        let send_amount = parseFloat(sendAmount.value);

        if (eth_balance <= 0) {
            dispatch(sendEvent(false, "Sorry, transaction failed. Please try again in a few minutes."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else if (eth_balance < send_amount) {
            dispatch(sendEvent(false, "Your ETH balance is less than the amount your are sending."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else {
            let new_base , send_base;
            let satoshi_amount = parseInt(send_amount * 1000000000000000000);
            var privateKey = prvKey;
            var keys  = new bitcoin.ECPair(bigi.fromHex(privateKey));
            var newtx = {
                inputs: [{addresses: [selfAddress]}],
                outputs: [{addresses: [sendAddress], value: satoshi_amount}]
            };

            if (net === "MainNet") {
                new_base = "https://api.blockcypher.com/v1/eth/main/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/eth/main/txs/send?token=" + BLOCK_TOKEN;
            } else {
                new_base = "https://api.blockcypher.com/v1/beth/test/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/beth/test/txs/send?token=" + BLOCK_TOKEN;
            }

            axios.post(new_base, newtx)
                .then(function (tmptx) {
                    console.log("create new transaction= "+JSON.stringify(tmptx));
                    var sendtx = {
                        tx: tmptx.data.tx
                    }
                    sendtx.tosign = tmptx.data.tosign
                    sendtx.signatures = tmptx.data.tosign.map(function(tosign, n) {
                       return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                    });

                    axios.post(send_base,sendtx).then(function (finaltx) {
                        console.log("finaltx= "+ finaltx);
                        dispatch(sendEvent(true, "Transaction complete! Your balance will automatically update when the blockchain has processed it."));
                        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                        return true;
                    })
                })
        }
    }
    // close confirm pane and clear fields
    dispatch(togglePane("confirmPane"));
    inputSendAddress.value = "";
    sendAddress = "";
    sendAmount.value = "";
    confirmButton.blur();
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
                    <strong>Confirm sending {sendAmount} ETH to {sendAddress}</strong>
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

class SendETH extends Component {
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

        if(!this.props.ethLoggedIn){
            this.props.dispatch(ethLoginRedirect("/sendETH"));
            this.props.history.push("/newEthereum");
        }
    }

    async componentDidMount() {
        let neo = await axios.get(apiURLFor("NEO"));
        let gas = await axios.get(apiURLFor("GAS"));
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
            eth_address,
            ethPrivKey,
            status,
            neo,
            gas,
            eth,
            net,
            confirmPane,
            selectedAsset,
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
        if (selectedAsset === "Gas") {
            btnClass = "btn-send";
            convertFunction = this.handleChangeNeo;
            formClass = "ledger-address";
            priceUSD = this.state.neo_usd;
            inputEnabled = true;
        } else if (selectedAsset === "Neo") {
            gasEnabled = true;
            inputEnabled = true;
            btnClass = "btn-send";
            formClass = "ledger-address";
            priceUSD = this.state.gas_usd;
            convertFunction = this.handleChangeGas;
        }
        return (
            <div>
                {
                    this.state.modalStatus?
                        <StatusMessage
                            sendAmount={sendAmount.value}
                            sendAddress={inputSendAddress.value}
                            handleCancel = {
                                () => {
                                    this.setState({
                                        modalStatus: false
                                    })
                                }
                            }
                            handleConfirm ={() => {
                                sendTransaction(
                                    dispatch,
                                    net,
                                    eth_address,
                                    ethPrivKey,
                                    selectedAsset,
                                    neo,
                                    gas,
                                    eth
                                )
                                this.setState({
                                    modalStatus: false
                                })
                            }}
                        />
                        :
                        null
                }
                <div id="send"
                onLoad={() =>
        					refreshBalance(
        						this.props.dispatch,
        						this.props.net,
        						this.props.address,
        						this.props.btc,
        						this.props.ltc,
        						this.props.eth
        					)
        				}
                >

                    <div className="row dash-panel">
                        <div className="col-xs-5">
                            <img
                                src={ethLogo}
                                alt=""
                                width="32"
                                className="neo-logo flipInY"
                            />
                            <h2> Ethereum</h2>
                            <hr className="dash-hr-wide" />
              							<span className="market-price"> {numeral(this.props.marketETHPrice).format("$0,0.00")} each</span><br />
              							<span className="font24">{numeral(this.props.eth/10000000000).format("0,0.00000000")} <span className="eth-price"> ETH</span></span><br />
              							<span className="market-price">{numeral((this.props.eth/10000000000) * this.props.marketETHPrice).format("$0,0.00")} USD</span>
                        </div>


                        <div className="col-xs-7 center">
                        <ETHChart />
                        </div>

                        <div className="clearboth" />

                        <div className="top-20">
                            <div className="col-xs-9">
                                <input
                                    className="form-send-white"
                                    id="center"
                                    placeholder="Enter a valid ETH public address here"
                                    ref={node => {
                                        inputSendAddress = node;
                                    }}
                                />
                            </div>

                            <div className="col-xs-3">

                                <ETHQRModalButton />

                            </div>

                            <div className="col-xs-5  top-20">
                                <input
                                    className="form-send-white"
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
                                <span className="com-soon block top-10">Amount in ETH to send</span>
                            </div>
                            <div className="col-xs-4 top-20">
                                <input
                                    className="form-send-white"
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
                                        onClick={() => {
                                            if (inputSendAddress.value === '') {
                                                dispatch(sendEvent(false, "You can not send without address."));
                                                setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                                return false;
                                            }


                                            if (parseFloat(sendAmount.value) <= 0) {
                                                dispatch(sendEvent(false, "You cannot send negative amounts of ETH."));
                                                setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                                return false;
                                            }

                                            this.setState({
                                                modalStatus: true
                                            })
                                        }
                                        }
                                        ref={node => {
                                            confirmButton = node;
                                        }}
                                    >
                                        <span className="glyphicon glyphicon-send marg-right-5"/>  Send
                                    </button>
                                </div>
                            </div>

                            <div className="clearboth"/>

                            <div className="col-xs-12 top-10">
                                <TransactionHistoryETH />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    blockHeight: state.metadata.blockHeight,
    ethBlockHeight: state.metadata.ethBlockHeight,
    wif: state.account.wif,
    address: state.account.address,
    eth_address:state.account.ethPubAddr,
    net: state.metadata.network,
    neo: state.wallet.Neo,
    marketETHPrice: state.wallet.marketETHPrice,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
    price: state.wallet.price,
    btc: state.account.Btc,
    ltc: state.account.Ltc,
    eth: state.account.Eth,
    wif: state.account.wif,
    neo: state.wallet.Neo,
    gas: state.wallet.Gas,
    btc: state.wallet.Btc,
    ltc: state.wallet.Ltc,
    eth: state.wallet.Eth,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    ethLoginRedirect: state.account.ethLoginRedirect,
    combined: state.wallet.combined
});

SendETH = connect(mapStateToProps) (SendETH);

export default SendETH;
