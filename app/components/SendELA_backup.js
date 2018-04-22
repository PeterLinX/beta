import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
//import Modal from "react-bootstrap-modal";
import Modal from "react-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import elastosLogo from "../img/ela.png";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import {
    sendEvent,
    clearTransactionEvent
} from "../modules/transactions";
import {
    syncElaTransactionHistory,
    block_index
} from "../components/NetworkSwitch";
import { elaLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { setCombinedBalance } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";
import TransactionHistoryELA from "./TransactionHistoryELA";
import ELAChart from "./NepCharts/ELAChart";
import ELAQRModalButton from "./ELAQRModalButton.js";

let sendAddress, sendAmount, confirmButton;

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
    return "https://min-api.cryptocompare.com/data/price?fsym=ELA&tsyms=USD";
};

const apiURLFor = val => {
    return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};


// form validators for input fields

// form validators for input fields
// const validateForm = (dispatch, asset, net) => {
//     // check for valid address
//     if (net === "MainNet") {
//
//         if (validMain) {
//             return true;
//         } else {
//             dispatch(sendEvent(false, "The address you entered was not valid."));
//             setTimeout(() => dispatch(clearTransactionEvent()), 2000);
//             return false;
//         }
//     } else {
//         var validTest = WAValidator.validate(
//             sendAddress.value,
//             "litecoin",
//             "testnet"
//         );
//         if (validTest) {
//             return true;
//         } else {
//             dispatch(sendEvent(false, "The address you entered was not valid."));
//             setTimeout(() => dispatch(clearTransactionEvent()), 2000);
//             return false;
//         }
//     }
// };


// perform send transaction
const sendTransaction = async (
    dispatch,
    net,
    selfAddress,
    ela_wif,
    asset,
    neo_balance,
    gas_balance,
    ela_balance
) => {
    // validate fields again for good measure (might have changed?)
    dispatch(sendEvent(true, "Processing..."));

    log(net, "SEND", selfAddress, {
        to: sendAddress.value,
        asset: asset,
        amount: sendAmount.value
    });
    console.log("Display ela balance\n");
    console.log(ela_balance);
    //Send bitcoin
    let send_amount = parseInt(sendAmount.value);
    let send_address = sendAddress.value;

    if (ela_balance <= 0) {
        dispatch(
            sendEvent(
                false,
                "Sorry, transaction failed. Please deposit ELA to your wallet."
            )
        );
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        return false;
    } else if (ela_balance < sendAmount.value) {
        dispatch(
            sendEvent(
                false,
                "Your ELA balance is less than the amount your are sending."
            )
        );
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        return false;
    } else {
        console.log("elastor transaction generating");
        let gen_res = await axios.post('http://159.89.224.63:8989/', {
            method: 'genRawTransaction',
            id: 0,
            params: [{
                Transactions:[
                    {
                        UTXOInputs:[
                {
                txid:"61c22a83bb96d958f473148fa64f3b2be02653c66ede506e83b82e522200d446",
                index:0,
                privateKey:ela_wif,
                address:selfAddress
                }],
                Outputs:[
                {
                address:send_address,
                amount:send_amount
                }
                        ]
                    }
                ]
            }]
        });

        console.log("generate transaction about ELA = " + JSON.stringify(gen_res));

        if (gen_res == null || gen_res == undefined) {
            dispatch(
                sendEvent(
                    false,
                    "The transaction generating is failed."
                )
            );
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else {
            let gen_result = gen_res.data.Result;
            let rawTx = gen_result.rawTx;
            let send_res = await axios.post("http://159.89.224.63:8989/",
                {
                    method: "sendRawTransaction",
                    id: 0,
                    params: [
                        {
                rawTx: rawTx
                        }
                    ]
                }
                )

            console.log("send transaction for ELA = " + JSON.stringify(send_res));

            if (send_res == null || send_res == undefined) {
                dispatch(
                    sendEvent(
                        false,
                        "Your ELA balance is less than the amount your are sending."
                    )
                );
                setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                return false;
            } else {
                dispatch(
                    sendEvent(
                        true,
                        "Transaction complete! Your balance will automatically update when the blockchain has processed it."
                    )
                );
                setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                return true;
                console.log("elastos sending transaction = " + JSON.stringify(res));
            }
        }
        }
    // close confirm pane and clear fields
    dispatch(togglePane("confirmPane"));
    sendAddress.value = "";
    sendAmount.value = "";
    confirmButton.blur();
};

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
                    <strong>Confirm sending {sendAmount} ELA to {sendAddress}</strong>
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

class SendELA extends Component {
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

        if (!this.props.elaLoggedIn) {
            this.props.dispatch(elaLoginRedirect("/sendELA"));
            this.props.history.push("/newElastos");
        }

    }

    async componentDidMount() {
        let neo = await axios.get(apiURLFor("ELA"));
        let gas = await axios.get(apiURLFor("ELA"));
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

        let gas = await axios.get(apiURL("ELA"));
        gas = gas.data.USD;
        this.setState({ gas: gas });
        console.log("done");
        const value = this.state.gas_usd / this.state.gas;
        this.setState({ value: value }, (sendAmount = value));
    }

    render() {
        const {
            dispatch,
            ela_address,
            ela_wif,
            neo,
            gas,
            ela,
            net,
            confirmPane,
            selectedAsset
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
            formClass = "form-control-exchange";
            priceUSD = this.state.neo_usd;
            inputEnabled = true;
        } else if (selectedAsset === "Neo") {
            gasEnabled = true;
            inputEnabled = true;
            btnClass = "btn-send";
            formClass = "form-control-exchange";
            priceUSD = this.state.gas_usd;
            convertFunction = this.handleChangeGas;
        }
        return (
            <div>
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
                sendTransaction(
                dispatch,
                net,
                ela_address,
                ela_wif,
                selectedAsset,
                neo,
                gas,
                ela
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
                        <div className="col-xs-5">
                <img
                src={elastosLogo}
                alt=""
                width="44"
                className="neo-logo fadeInDown"
                />
                <h2>Elastos (ELA)</h2>
                <hr className="dash-hr-wide" />
  							<span className="market-price"> {numeral(this.props.marketELAPrice).format("$0,0.00")} each</span><br />
  							<span className="font24">{numeral(
  								Math.floor(this.props.ela * 100000) / 100000
  							).format("0,0.00000000")} <span className="neo-price"> ELA</span></span><br />
  							<span className="market-price">{numeral(this.props.ela * this.props.marketELAPrice).format("$0,0.00")} USD</span>
                </div>

                <div className="col-xs-7 center">
                <ELAChart />
                </div>


                <div className="clearboth" />

                <div className="top-20">
                  <div className="col-xs-9">
                  <input
                  className="form-send-white"
                  id="center"
                  placeholder="Enter a valid ELA public address here"
                  ref={node => {
                  sendAddress = node;
                  }} />
                </div>

                <div className="col-xs-3">
                <ELAQRModalButton />
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
                <div className="clearboth" />
                <span className="com-soon block top-10">
                  Amount in ELA to send
                </span>
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
                <div className="clearboth" />
                <span className="com-soon block top-10">Calculated in USD</span>
                </div>
                <div className="col-xs-3 top-20">
                <div id="sendAddress">
                <button
                className="grey-button"
                onClick={() => {
                if (sendAddress.value === '') {
                dispatch(sendEvent(false, "You can not send without address."));
                setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                return false;
                }


                if (parseFloat(sendAmount.value) <= 0) {
                dispatch(sendEvent(false, "You cannot send negative amounts of ELA."));
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
                <span className="glyphicon glyphicon-send marg-right-5" />{" "}
                Send
                </button>
                </div>
                </div>

                <div className="clearboth" />

                <div className="col-xs-12 com-soon">
                Fees: 0.05% ELA<br />
                </div>


                <div className="col-xs-12 top-10">
                    <TransactionHistoryELA />
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
    blockIndex: state.metadata.block_index,
    wif: state.account.wif,
    address: state.account.address,
    ela_address: state.account.elaPubAddr,
    ela_wif: state.account.elaPrivKey,
    net: state.metadata.network,
    neo: state.wallet.Neo,
    marketELAPrice: state.wallet.marketELAPrice,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
    ela: state.wallet.Ela,
    marketELAPrice: state.wallet.marketELAPrice,
    elaLoggedIn: state.account.elaLoggedIn,
    elaPrivKey: state.account.elaPrivKey,
    elaPubAddr: state.account.elaPubAddr,
    combined: state.wallet.combined
});

SendELA = connect(mapStateToProps)(SendELA);

export default SendELA;
