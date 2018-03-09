import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Modal from "react-bootstrap-modal";
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

var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require('coinkey');
var ethereum_address = require("ethereum-address");

let sendAddress, sendAmount, confirmButton;

const apiURL = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
};

const apiURLFor = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym="+val+"&tsyms=USD";
};
// form validators for input fields

// form validators for input fields
const validateForm = (dispatch) => {
    if (ethereum_address.isAddress(sendAddress.value)) {
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
    if (validateForm(dispatch) === true) {
        dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress.value,
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
            let satoshi_amount = parseInt(send_amount * 100000000);
            var privateKey = prvKey;
            var keys  = new bitcoin.ECPair(bigi.fromHex(privateKey));
            var newtx = {
                inputs: [{addresses: [selfAddress]}],
                outputs: [{addresses: [sendAddress.value], value: satoshi_amount}]
            };

            if (net === "MainNet") {
                new_base = "https://api.blockcypher.com/v1/eth/main/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/eth/main/txs/send?token=" + BLOCK_TOKEN;
            } else {
                new_base = "https://api.blockcypher.com/v1/eth/test/txs/new?token=" + BLOCK_TOKEN;
                send_base = "https://api.blockcypher.com/v1/eth/test/txs/send?token=" + BLOCK_TOKEN;
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
    sendAddress.value = "";
    sendAmount.value = "";
    confirmButton.blur();
}

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
            inputEnabled: true
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
            btnClass = "eth-button";
            convertFunction = this.handleChangeNeo;
            formClass = "ledger-address";
            priceUSD = this.state.neo_usd;
            inputEnabled = true;
        } else if (selectedAsset === "Neo") {
            gasEnabled = true;
            inputEnabled = true;
            btnClass = "eth-button";
            formClass = "ledger-address";
            priceUSD = this.state.gas_usd;
            convertFunction = this.handleChangeGas;
        }
        return (
            <div>
                <div id="send">

                    <div className="row dash-panel">
                        <div className="col-xs-8">
                            <img
                                src={ethLogo}
                                alt=""
                                width="32"
                                className="neo-logo fadeInDown"
                            />
                            <h2>Send Ethereum (ETH)</h2>
                        </div>

                        <div
                            className="col-xs-1 center top-10 send-info"
                            onClick={() =>
                                refreshBalance(
                                    this.props.dispatch,
                                    this.props.net,
                                    this.props.eth_address
                                )
                            }
                        >
                            <span className="glyphicon glyphicon-refresh font24" />
                        </div>

                        <div className="col-xs-3 center">
                            <div className="send-panel-price">{numeral(this.props.eth).format("0,0.0000000")} <span className="eth-price"> ETH</span></div>

                            <span className="market-price">{numeral(this.props.eth * this.props.marketETHPrice).format("$0,0.00")} USD</span>
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
                                    placeholder="Enter a valid ETH public address here"
                                    ref={node => {
                                        sendAddress = node;
                                    }}
                                />
                            </div>

                            <div className="col-xs-3">

                                <Link to={ "/receiveEthereum" }>
                                    <button className="grey-button com-soon" >
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
                                <span className="com-soon block top-10">Amount in ETH to send</span>
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
                                                eth_address,
                                                ethPrivKey,
                                                selectedAsset,
                                                neo,
                                                gas,
                                                this.props.eth
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

                            <div className="clearboth"/>

                            <div className="col-xs-12 com-soon">
                                Fees: 0.0001 ETH/KB<br />
                                Block: {this.props.blockIndex}{" "}

                            </div>
                            <div className="col-xs-12 top-20">
                                <TransactionHistoryETH />
                            </div>
                        </div>
                    </div>

                    <div className="send-notice">
                        <div className="col-xs-2"/>
                        <div className="col-xs-8">
                            <p className="center donations"
                               data-tip
                               data-for="donateTip"
                               onClick={() => clipboard.writeText("LP7vnYjxKQB7dkik38ghMhC724iVJ7Cqir")}
                            >Morpheus Dev Team: LP7vnYjxKQB7dkik38ghMhC724iVJ7Cqir</p>
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
    ethBlockHeight: state.metadata.ethBlockHeight,
    wif: state.account.wif,
    address: state.account.address,
    eth_address:state.account.ethPubAddr,
    net: state.metadata.network,
    neo: state.wallet.Neo,
    marketETHPrice: state.wallet.marketETHPrice,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
    eth: state.wallet.Eth,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    combined: state.wallet.combined
});

SendETH = connect(mapStateToProps) (SendETH);

export default SendETH;
