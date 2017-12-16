import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
var Modal = require("react-bootstrap-modal");
import axios from "axios";

import { togglePane } from "../modules/dashboard";
import {
  sendEvent,
  clearTransactionEvent,
  toggleAsset
} from "../modules/transactions";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import neoLogo from "../images/neo.png";
import Claim from "./Claim.js";
import TopBar from "./TopBar";

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
    this.setState({ value: event.target.value });
    const value = event.target.value * this.state.neo;
    this.setState({ neo_usd: value });
  }

  handleChangeGas(event) {
    this.setState({ value: event.target.value });
    const value = event.target.value * this.state.gas;
    this.setState({ gas_usd: value });
  }

  async handleChangeUSD(event) {
    this.setState(
      { gas_usd: event.target.value },
      console.log(event.target.value)
    );

    let gas = await axios.get(apiURL("GAS"));
    gas = gas.data.USD;
    this.setState({ gas: gas });
    console.log("done");
    const value = ((this.state.gas_usd * 100) / 100) / (this.state.gas);
    this.setState({ value: value }, console.log(this.state.value));
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
            <div className="col-xs-6">
              <img
                src={neoLogo}
                alt=""
                width="48"
                className="neo-logo logobounce"
              />
              <h2>Send Neo or Gas</h2>
            </div>
            <div className="col-xs-4" />
            <div className="col-xs-2">
              <div
                id="sendAsset"
                className={btnClass}
                style={{ width: "100%" }}
                data-tip
                data-for="assetTip"
                onClick={() => {
                  this.setState({ gas_usd: 0, neo_usd: 0 });
                  document.getElementById("assetAmount").value = "";
                  dispatch(toggleAsset());
                }}
              >
                {selectedAsset}
              </div>
              <ReactTooltip
                className="solidTip"
                id="assetTip"
                place="bottom"
                type="dark"
                effect="solid"
              >
                <span>Click To Switch</span>
              </ReactTooltip>
            </div>

            <div id="sendAddress">
              <div className="clearboth" />

              <div id="sendAmount">
                <div className="col-xs-12">
                  <input
                    className={formClass}
                    id="center"
                    placeholder="Enter a valid NEO public address"
                    ref={node => {
                      sendAddress = node;
                    }}
                  />
                </div>
                <div className="col-xs-6  top-20">
                  <input
                    className={formClass}
                    type="number"
                    id="assetAmount"
                    min="0"
                    onChange={convertFunction}
                    value={
                      inputEnabled === false ? this.state.value : sendAmount
                    }
                    placeholder="Enter amount to send"
                    ref={node => {
                      sendAmount = node;
                    }}
                  />
                </div>
                <div className="col-xs-4 top-20">
                  <input
                    className={formClass}
                    id="sendAmount"
                    onChange={this.handleChangeUSD}
                    onClick={this.handleChangeUSD}
                    disabled={gasEnabled === false ? true : false}
                    placeholder="Amount in US"
                    value={`${this.state.gas_usd}`}
                  />
                  <label className="amount-dollar">$</label>
                </div>
                <div className="col-xs-2 top-20">
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
                          gas
                        )
                      }
                      ref={node => {
                        confirmButton = node;
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="send-notice">
          <p>
            All NEO and GAS transactions are free. Only send NEO and GAS to a
            valid NEO address. Sending to an address other than a NEO address
            can result in your NEO/GAS being lost. You cannot send a fraction of
            a NEO.
          </p>
          <p>Gas Donations: AG3p13w3b1PT7UZtsYBoQrt6yjjNhPNK8b</p>
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

Send = connect(mapStateToProps)(Send);

export default Send;
