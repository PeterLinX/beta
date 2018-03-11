import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import axios from "axios";
import Modal from "react-bootstrap-modal";
import QRCode from "qrcode.react";
import { clipboard, shell } from "electron";
import SplitPane from "react-split-pane";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import CountUp, { startAnimation } from "react-countup";
import neoLogo from "../img/neo.png";
import { doSendAsset, verifyAddress, getTransactionHistory } from "neon-js";
import Neon, { wallet, api } from "@cityofzion/neon-js";
import {
	initiateGetBalance,
	intervals,
	syncTransactionHistory
} from "../components/NetworkSwitch";
import {
	resetPrice,
	setMarketPrice,
	setCombinedBalance
} from "../modules/wallet";
import { log } from "../util/Logs";
import ClaimLedgerGas from "./ClaimLedgerGas.js";
import Dashlogo from "../components/Brand/Dashlogo";
import { togglePane } from "../modules/dashboard";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import commNode from "../modules/ledger/ledger-comm-node";

import WalletInfo from "../components/WalletInfo";
import Logout from "../components/Logout";



const BIP44_PATH =
  "8000002C" + "80000378" + "80000000" + "00000000" + "00000000";

let sendAddress, sendAmount, confirmButton;

const apiURL = val => {
  return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};

// form validators for input fields
const validateForm = (dispatch, neo_balance, gas_balance, asset) => {
  // check for valid address
  try {
    if (verifyAddress(sendAddress) !== true || sendAddress.charAt(0) !== "A") {
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

const resetGeneratedKey = dispatch => {
  dispatch(resetKey());
};

const refreshBalance = (dispatch, net, address ) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class LedgerDashboard extends Component {
  constructor(props) {
		super(props);
		this.state = {
			combinedPrice: 0
		};
  }

  async componentDidMount() {
    // only logging public information here
    await log(this.props.net, "LOGIN", this.props.address, {});
    await initiateGetBalance(
      this.props.dispatch,
      this.props.net,
      this.props.address,
      this.props.price
    );
    resetGeneratedKey(this.props.dispatch);
  }

  render = () => {
    let sendPaneClosed;
    if (this.props.sendPane == true) {
      sendPaneClosed = "0%";
    } else {
      if (this.props.confirmPane == false) {
        sendPaneClosed = "21%";
      } else {
        sendPaneClosed = "15%";
      }
    }

    let dash = (
      <div>
        <WalletInfo />
      </div>
    );

    if (this.props.location.pathname !== "/dashboard") {
      dash = <div />;
    }

    return (
      <div>
        <div id="mainNav" className="main-nav">
          <div className="navbar navbar-inverse">
            <div className="navbar-header">
            <div
              className="logoContainer fadeInDown"
              onClick={() =>
                refreshBalance(
                  this.props.dispatch,
                  this.props.net,
                  this.props.address,
                )
              }
            >
                <Dashlogo width={85} />
              </div>
              <div
                id="balance"
              >

                <CountUp
                  className="account-balance"
                  end={this.props.combined}
                  duration={2}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                  decimals={2}
                  decimal="."
                  prefix="$"
                  ref={(countUp) => {
                    this.totalCountUp = countUp;
                  }}
                />
                <span className="bal-usd">USD</span>
                <span className="comb-bal">Available Balance</span>
              </div>
            </div>
            <div className="clearfix" />
            <hr className="dash-hr" />
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link to={"/LoginLedgerNanoS"} activeClassName="active">
                    <span className="glyphicon glyphicon-th-large" /> Ledger
                    Nano S
                  </Link>
                </li>
                <li>
                  <Link to={"/LedgerAssetPortfolio"} activeClassName="active">
                    <span className="glyphicon glyphicon-dashboard" /> Portfolio
                  </Link>
                </li>
                <li>
                  <Link to={"/TransactionLedger"} activeClassName="active">
                    <span className="glyphicon glyphicon-list-alt" /> History
                  </Link>
                </li>
                <li>
                  <Link to={"/"} activeClassName="active">
                    <span className="glyphicon glyphicon-chevron-left" /> Return
                    to Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <span className="dashnetwork">Network: {this.props.net}</span>
          <div className="copyright">&copy; Copyright 2018 Morpheus</div>
        </div>
      <div>
        {this.props.children}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  sendPane: state.dashboard.sendPane,
  confirmPane: state.dashboard.confirmPane,
  blockHeight: state.metadata.blockHeight,
  net: state.metadata.network,
  address: state.account.address,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  combined: state.wallet.combined
});

LedgerDashboard = connect(mapStateToProps)(LedgerDashboard);

export default LedgerDashboard;
