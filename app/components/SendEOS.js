import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
//import Modal from "react-bootstrap-modal";
import Modal from "react-modal";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import eosLogo  from "../img/eos.png";
import TransactionHistoryEOS  from "./TransactionHistoryEOS";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import {BLOCK_TOKEN} from "../core/constants";
import { BITGO_TOKEN } from "../core/constants";
import numeral from "numeral";
import { block_index} from "../components/NetworkSwitch";
import { ethLoginRedirect } from "../modules/account";

var bitcoin = require("bitcoinjs-lib");
var WAValidator = require("wallet-address-validator");
var bigi = require("bigi");
var buffer = require("buffer");
var bcypher = require("blockcypher");
var CoinKey = require("coinkey");
var ethereum_address = require("ethereum-address");

let sendAddress, sendAmount, confirmButton, inputSendAddress;

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
    return "https://min-api.cryptocompare.com/data/price?fsym=EOS&tsyms=USD";
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
    eos_balance
) => {
    sendAddress = inputSendAddress.value;
    if (validateForm(dispatch) === true) {
        dispatch(sendEvent(true, "Processing..."));

        log(net, "SEND", selfAddress, {
            to: sendAddress,
            asset: asset,
            amount: sendAmount.value
        });

        let send_amount = parseInt(sendAmount.value);

        if (eos_balance <= 0) {
            dispatch(sendEvent(false, "Sorry, transaction failed. Please try again in a few minutes."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else if (eos_balance < send_amount) {
            dispatch(sendEvent(false, "Your EOS balance is less than the amount your are sending."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else {
            let params = {
                amount: send_amount,
                address: sendAddress,
                walletPassphrase: 'secretpassphrase1a5df8380e0e30'
            }
            var BitGoJS = require("bitgo");
            console.log("BitGoJS is created");
            var bitgo = BitGoJS.BitGo({env: 'main', accessToken: BITGO_TOKEN });
            console.log("bitgo is created");
            bitgo.coin("eth").wallets().getWalletByAddress({address: eth_address})
                .then(
                    function (wallet) {
                        console.log("wallet is get by address");
                        wallet.send(params)
                            .then(function(transaction) {
                                // print transaction details
                                console.dir("EOS send transaction = " + JSON.stringify(transaction));
                            });
                    }
                );

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
                    <strong>Confirm sending {sendAmount} EOS to {sendAddress}</strong>
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

class SendEOS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            eos: 0,
            eos_usd: 0,
            value: 0,
            inputEnabled: true,
            modalStatus: false
        };
        this.handleChangeEos = this.handleChangeEos.bind(this);
        this.handleChangeUSD = this.handleChangeUSD.bind(this);

        if(!this.props.ethLoggedIn){
            this.props.dispatch(ethLoginRedirect("/sendEOS"));
            this.props.history.push("/newEthereum");
        }
    }

    async componentDidMount() {
        let eos = await axios.get(apiURLFor("EOS"));
        eos = eos.data.USD;
        this.setState({ eos: eos });
    }

    handleChangeEos(event) {
        this.setState({ value: event.target.value }, (sendAmount = value));
        const value = event.target.value * this.state.eos;
        this.setState({ eos_usd: value });
    }


    async handleChangeUSD(event) {
        this.setState({ eos_usd: event.target.value });

        let eos = await axios.get(apiURL("EOS"));
        eos = eos.data.USD;
        this.setState({ eos: eos });
        console.log("done");
        const value = this.state.eos_usd / this.state.eos;
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
            eos,
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
        let inputEnabled = true;
        let convertFunction = this.handleChangeEos;
        btnClass = "btn-send";
        formClass = "ledger-address";
        priceUSD = this.state.eos_usd;

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
                                    eos
                                )
                                this.setState({
                                    modalStatus: false
                                })
                            }}
                        />
                        :
                        null
                }
                <div id="send">

                    <div className="row dash-panel">
                        <div className="col-xs-8">
                            <img
                                src={eosLogo}
                                alt=""
                                width="44"
                                className="neo-logo fadeInDown"
                            />
                            <h2>Send EOS.io</h2>
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
                            <div className="send-panel-price">{numeral(this.props.eos/10000000000).format("0,0.00000")} <span className="eth-price"> EOS</span></div>

                            <span className="market-price">{numeral((this.props.eos/10000000000) * this.props.marketETHPrice).format("$0,0.00")} USD</span>
                        </div>

                        <div className="col-xs-12 center">
                            <hr className="dash-hr-wide top-20" />
                        </div>

                        <div className="clearboth" />

                        <div className="top-20">
                            <div className="col-xs-9">
                                <input
                                    className="form-control-exchange"
                                    id="center"
                                    placeholder="Enter a valid ETH public address here"
                                    ref={node => {
                                        inputSendAddress = node;
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
                                    className="form-control-exchange"
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
                                <span className="com-soon block top-10">Amount in EOS to send</span>
                            </div>
                            <div className="col-xs-4 top-20">
                                <input
                                    className="form-control-exchange"
                                    id="sendAmount"
                                    onChange={this.handleChangeUSD}
                                    onClick={this.handleChangeUSD}
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

                            <div className="col-xs-12 com-soon">
                                Block: {this.props.blockIndex}{" "}
                            </div>
                            <div className="col-xs-12 top-20">
                                <TransactionHistoryEOS />
                            </div>
                        </div>
                    </div>

                    <div className="send-notice">
                        <div className="col-xs-2"/>
                        <div className="col-xs-8">
                            <p className="center donations"
                               data-tip
                               data-for="donateTip"
                               onClick={() => clipboard.writeText("0x3276d45fc384e472aa47ee53f8a0a09c22112f5f")}
                            >Morpheus Dev Team: 0x3276d45fc384e472aa47ee53f8a0a09c22112f5f</p>
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
    marketETHPrice: state.wallet.marketETHPrice,
    marketEOSPrice: state.wallet.marketEOSPrice,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
    eos: state.wallet.Eos,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    ethLoginRedirect: state.account.ethLoginRedirect,
    combined: state.wallet.combined
});

SendEOS = connect(mapStateToProps) (SendEOS);

export default SendEOS;
