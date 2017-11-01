import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import { Link } from "react-router";
import QRCode from "qrcode";
import FaArrowUpward from "react-icons/lib/fa/arrow-circle-up";
import { NetworkSwitch } from "../components/NetworkSwitch";
import WalletInfo from "../components/WalletInfo";
import TransactionHistory from "../components/TransactionHistory";
import Exchange from "../components/Exchange";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import Logout from "../components/Logout";
import Send from "../components/Send";
import { togglePane } from "../modules/dashboard";
import { version } from "../../package.json";
import { log } from "../util/Logs";
import Logo from "../components/Brand/LogoWords";

const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class Dashboard extends Component {
  componentDidMount = () => {
    // only logging public information here
    log(this.props.net, "LOGIN", this.props.address, {});
    initiateGetBalance(
      this.props.dispatch,
      this.props.net,
      this.props.address,
      this.props.price
    );
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
      <div className="container">
        <WalletInfo />
      </div>
    );

    if (this.props.location.pathname !== "/dashboard") {
      dash = <div />;
    }
    console.log(this.props.location);
    return (
      <div>
        <div id="mainNav" className="main-nav">
          <div className="navbar navbar-inverse">
            <div className="navbar-header">
              <div className="logoContainer">
                <Logo width={90} />
              </div>
              <div id="balance">
                <span style={{ fontSize: "10px" }}>Combined Value</span>
                <br />
                {this.props.price}
              </div>
            </div>
            <div className="clearfix" />
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link to={"/dashboard"} exact activeClassName="active">
                    <div className="glyphicon glyphicon-user" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to={"/send"} exact activeClassName="active">
                    <span className="glyphicon glyphicon-send" /> Send
                  </Link>
                </li>
                <li>
                  <Link to={"/receive"} exact activeClassName="active">
                    <span className="glyphicon glyphicon-qrcode" /> Receive
                  </Link>
                </li>
                <li>
                  <Link to={"/exchange"} exact activeClassName="active">
                    <span className="glyphicon glyphicon-refresh" /> Exchange
                  </Link>
                </li>
                <li>
                  <Link to={"/transactionHistory"} exact activeClassName="active">
                    <span className="glyphicon glyphicon-list-alt" /> History
                  </Link>
                </li>
                <li>
                  <Link to={"/settings"} exact activeClassName="active">
                    <span className="glyphicon glyphicon-lock" /> Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="copyright">&copy; Copyright 2017 Morpeus Inc.</div>
        </div>
        <div style={{ marginLeft: 230, marginTop: 20 }}>
          <div className="container">{this.props.children}</div>
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
  price: state.wallet.price
});

Dashboard = connect(mapStateToProps)(Dashboard);

export default Dashboard;
