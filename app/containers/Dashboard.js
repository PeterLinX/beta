import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import { Link } from "react-router";
import QRCode from "qrcode";
import axios from "axios";
import numeral from "numeral";
import { resetKey } from "../modules/generateWallet";
import FaArrowUpward from "react-icons/lib/fa/arrow-circle-up";
import { NetworkSwitch } from "../components/NetworkSwitch";
import WalletInfo from "../components/WalletInfo";
import TransactionHistory from "../components/TransactionHistory";
import { resetBalanceSync } from "../components/NetworkSwitch";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { togglePane } from "../modules/dashboard";
import { version } from "../../package.json";
import { log } from "../util/Logs";
import { shell, clipboard } from "electron";

import {
    setBalance,
    setMarketPrice,
    resetPrice,
    setTransactionHistory,
    setBtcTransactionHistory,
    setLtcTransactionHistory,
    setEthTransactionHistory,
    setBtcBalance,
    setLtcBalance,
    setCombinedBalance,
    setEthBalance
} from "../modules/wallet";

import Logout from "../components/Logout";
import AssetPortfolio from "../components/AssetPortfolio";
import Dashlogo from "../components/Brand/Dashlogo";
import ReactTooltip from "react-tooltip";
import CountUp, { startAnimation } from "react-countup";
import ThemeSwitch from "../components/ThemeSwitch";

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

const refreshBalance = (dispatch, net, address ,btc ,ltc ,eth) => {
  dispatch(sendEvent(true, "Refreshing balances and prices..."));
  setTimeout(() => dispatch(clearTransactionEvent()), 3000);
  initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth).then(response => {
  dispatch(sendEvent(true, "Prices and balances updated."));
  setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};


const resetGeneratedKey = dispatch => {
  dispatch(resetKey());
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      combinedPrice: 0
    };
  }

componentDidMount = () => {
    resetBalanceSync(
      this.props.dispatch,
      this.props.net,
      this.props.address,
)};


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
      <div className="">
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
                    this.props.btc,
                    this.props.ltc,
                    this.props.eth
                  )
                }
              >
                <Dashlogo width={85} />
              </div>

              <div
                id="balance"
                onClick={(event) => {
                  startAnimation(
                  this.totalCountUp
                )
              }}
              >

                <CountUp
                  className="account-balance"
                  start={0}
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
                  <Link to={"/dashboard"} >
                    <div className="glyphicon glyphicon-stats" /> Dashboard
                  </Link>
                </li>

                <li>
                  <Link to={"/assetPortfolio"} >
                    <div className="glyphicon glyphicon-dashboard" /> Portfolio
                  </Link>
                </li>

                <li>
                  <Link to={"/send"} >
                    <span className="glyphicon glyphicon-send" /> Send
                  </Link>
                </li>

                <li>
                  <Link to={"/receive"} >
                    <span className="glyphicon glyphicon-qrcode" /> Receive
                  </Link>
                </li>

                <li>
                  <Link to={"/transactionHistory"} >
                    <span className="glyphicon glyphicon-list-alt" /> Transactions
                  </Link>
                </li>
                <li>
                  <Link to={"/dappBrowser"} >
                    <span className="glyphicon glyphicon-heart" /> dApp Browser
                  </Link>
                </li>
                <li>
                  <Link to={"/settings"} >
                    <span className="glyphicon glyphicon-lock" /> Settings
                  </Link>
                </li>
                <li>
                  <Link>
                    <ThemeSwitch/>
                  </Link>
                </li>


              </ul>
            </div>
          </div>
          <span className="dashnetwork center pointer">
          Version: 0.0.583<br />
          <div
          onClick={() =>
    			openExplorer("http://monitor.cityofzion.io")
    			}
          >{this.props.net} Block: {this.props.blockHeight}</div>
          Copyright &copy; Morpheus
          </span>

        </div>
        <div className="main-container">
          {this.props.children}
          {dash}
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
  btcLoggedIn: state.account.btcLoggedIn,
  btcPrivKey: state.account.btcPrivKey,
  btcPubAddr: state.account.btcPubAddr,
  btcLoginRedirect: state.account.btcLoginRedirect,
  ltcPubAddr: state.account.ltcPubAddr,
  ethPubAddr: state.account.ethPubAddr,
  price: state.wallet.price,
  combined: state.wallet.combined,
  btc: state.account.Btc,
  ltc: state.account.Ltc,
  eth: state.account.Eth,
  btc: state.wallet.Btc,
  ltc: state.wallet.Ltc,
  eth: state.wallet.Eth
});

Dashboard = connect(mapStateToProps)(Dashboard);

export default Dashboard;
