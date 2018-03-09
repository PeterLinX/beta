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
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import Logout from "../components/Logout";
import Send from "../components/Send";
import { togglePane } from "../modules/dashboard";
import { version } from "../../package.json";
import { log } from "../util/Logs";
import Dashlogo from "../components/Brand/Dashlogo";
import ReactTooltip from "react-tooltip";
import CountUp, { startAnimation } from "react-countup";

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
    await this.getCombinedBalance(this.props.neo, this.props.gas);
  }

  getCombinedBalance = async (neo, gas) => {
    let neoPrice = await axios.get(
      "https://api.coinmarketcap.com/v1/ticker/neo/"
    );
    let gasPrice = await axios.get(
      "https://api.coinmarketcap.com/v1/ticker/gas/"
    );
    neoPrice = neoPrice.data[0].price_usd;
    gasPrice = gasPrice.data[0].price_usd;

    let value = neoPrice * neo + gasPrice * gas;
    let combinedPrice = Math.round(value * 100) / 100;
    this.setState({ combinedPrice: combinedPrice });
  };

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
                className="logoContainer"
                onCLick={() => {
                  this.getLedgerAddress();
                }}
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
                    <span className="glyphicon glyphicon-question-sign" /> Help
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

Dashboard = connect(mapStateToProps)(Dashboard);

export default Dashboard;