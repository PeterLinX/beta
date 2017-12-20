import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Modal from "react-bootstrap-modal";
import QRCode from "qrcode.react";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import ledgerLogo from "../images/ledger-logo.png";
import Claim from "./Claim.js";
import TopBar from "./TopBar";
import { togglePane } from "../modules/dashboard";
import {
  sendEvent,
  clearTransactionEvent,
  toggleAsset
} from "../modules/transactions";

let sendAddress, sendAmount, confirmButton;

const apiURL = val => {
  return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
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

// perform send transaction
const sendTransaction = (
  dispatch,
  net,
  selfAddress,
  wif,
  asset,
  neo_balance,
  gas_balance
) => {
  // validate fields again for good measure (might have changed?)
  if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
    dispatch(sendEvent(true, "Processing..."));
    log(net, "SEND", selfAddress, {
      to: sendAddress.value,
      asset: asset,
      amount: sendAmount.value
    });
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
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      })
      .catch(e => {
        dispatch(sendEvent(false, "Transaction failed!"));
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      });
  }
  // close confirm pane and clear fields
  dispatch(togglePane("confirmPane"));
  sendAddress.value = "";
  sendAmount.value = "";
  confirmButton.blur();
};

class Ledger extends Component {
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
    return (
      <div id="send">
        <div id="sendPane">
          <TopBar />
          <div className="row send-neo fadeInDown">
            <div className="col-xs-4">
              <img
                src={ledgerLogo}
                alt=""
                width="48"
                className="ledger-logo logobounce"
              />
              <h2>Ledger</h2>
            </div>
            <div className="col-xs-3">
            <h4 className="neo-text">0 <span>NEO</span></h4>
            </div>

            <div
            data-tip
            data-for="claimTip"
            className="col-xs-2 center">
            Claim Gas
            <div>0.00000000</div>

            <ReactTooltip
              className="solidTip"
              id="claimTip"
              place="top"
              type="light"
              effect="solid"
            >
            <span>Click to claim GAS on Ledger Nano S</span>
          </ReactTooltip>
            </div>

            <div className="col-xs-3">
            <h4 className="gas-text top-10">0.0000 <span>GAS</span></h4>
            </div>

            <div className="clearboth" />

            <div className="col-xs-4 top-20">
            <div className="ledgerQRBox center animated fadeInDown">
              <QRCode size={120} value={this.props.address} />
            </div>
            </div>

            <div className="col-xs-8">
            <h4>Ledger Nano NEO Address</h4>
              <input
                className="ledger-address"
                id="center"
                placeholder={this.props.address}
                ref={node => {
                  sendAddress = node;
                }}
              />
            </div>


            <div className="col-xs-4  top-20">
            Amount to Transfer
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
            </div>
            <div className="col-xs-4 top-20">
            Value in USD
              <input
                className={formClass}
                id="sendAmount"
                onChange={this.handleChangeUSD}
                onClick={this.handleChangeUSD}
                disabled={gasEnabled === false ? true : false}
                placeholder="Amount in US"
                value={`${priceUSD}`}
              />
              <label className="amount-dollar-ledger">$</label>
            </div>

            <div className="clearboth" />

            <div className="col-xs-4 top-20">
            <div id="sendAddress">
              <div
                id="sendAsset"
                className={btnClass}
                style={{ width: "100%" }}
                data-tip
                data-for="assetTip"
                onClick={() => {
                  this.setState({ gas_usd: 0, neo_usd: 0, value: 0 });
                  document.getElementById("assetAmount").value = "";
                  dispatch(toggleAsset());
                }}
              >
                {selectedAsset}
              </div>
              <ReactTooltip
                className="solidTip"
                id="assetTip"
                place="top"
                type="light"
                effect="solid"
              >
                <span>Click to switch between NEO and GAS</span>
              </ReactTooltip>
              </div>
            </div>

            <div className="col-xs-4 top-20">
            <div id="sendAddress">
            <button
              className="grey-button"
              data-tip
              data-for="withdrawTip"
            >
              Withdraw
            </button>
            <ReactTooltip
              className="solidTip"
              id="withdrawTip"
              place="top"
              type="light"
              effect="solid"
            >
              <span>Withdraw from Ledger Nano S to Morpheus</span>
            </ReactTooltip>
            </div>
            </div>
            <div className="col-xs-4 top-20">
              <div id="sendAddress">
                <button
                  className="grey-button"
                  data-tip
                  data-for="sendTip"
                  onClick={() =>
                    sendTransaction(
                      dispatch,
                      net,
                      address,
                      wif,
                      selectedAsset,
                      neo,
                      gas
                    )
                  }
                  ref={node => {
                    confirmButton = node;
                  }}
                >
                  Send
                </button>
                <ReactTooltip
                  className="solidTip"
                  id="sendTip"
                  place="top"
                  type="light"
                  effect="solid"
                >
                  <span>Send to Ledger Nano S from Morpheus</span>
                </ReactTooltip>
              </div>
            </div>

              <div className="clearboth" />
          </div>
        </div>

        <div className="top-20 center">
          <p>
            Please ensure that your Ledger Nano S is plugged in, unlocked and has the NEO app installed. Your NEO address from your Ledger Nano S should appear above. Verify address is correct before sending.
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  wif: state.account.wif,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  selectedAsset: state.transactions.selectedAsset,
  confirmPane: state.dashboard.confirmPane
});

Ledger = connect(mapStateToProps)(Ledger);

export default Ledger;
