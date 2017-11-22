import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import MdSync from "react-icons/lib/md/sync";
import QRCode from "qrcode.react";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import neoLogo from "../images/neo.png";
import NeoLogo from "./Brand/Neo";
import BtcLogo from "./Brand/Bitcoin";
import TopBar from "./TopBar";
import { Link } from "react-router";

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class Exchange extends Component {
  componentDidMount = () => {
    initiateGetBalance(this.props.dispatch, this.props.net, this.props.address);
    QRCode.toCanvas(this.canvas, this.props.address, { version: 5 }, err => {
      if (err) console.log(err);
    });
  };

  render = () => {
    if (this.props.address != null) {
      return (
      <div>
        <TopBar />

        <div className="progress-bar2 fadeInLeft-ex"></div>
          <div className="row prog-info top-20">
          <div className="col-xs-2 col-xs-offset-1 sm-text center">
          Enter Amount to Deposit
          </div>
          <div className="col-xs-2 sm-text center">
          Placing Your Order
          </div>
          <div className="col-xs-2 sm-text center">
          Generating Bitcoin Address for Deposit
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Processing Your Order
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Transaction Complete!
          </div>
        </div>

        <div className="top-130">
        <div className="settings-panel fadeInDown">

        <div className="com-soon row fadeInDown">

        <div className="col-xs-4">

        <div className="exchange-qr center animated fadeInDown">
          <QRCode size={150} value={this.props.address} />
        </div>
        </div>
        <div className="col-xs-8">
        <div className="exch-logos"><BtcLogo width={40} /></div>
        <h4 className="top-20">Deposit 0.000000 BTC and receive 0 NEO</h4>
        <input className="form-control-exchange center top-10" disabled placeholder="17mE9Y7ERqpn6oUn5TEteNrnEmmXUsQw76" />
        <p className="sm-text">Only deposit Bitcoin (BTC) to the address above to receive NEO.</p>
        <div className="row top-20">
        <div className="col-xs-8 center">
        <button className="grey-button">Continue</button>
        </div>
        <div className="col-xs-4">
        <p className="sm-text">Powered by:</p>
        <div className="changelly-logo"></div>
        </div>
        </div>
        </div>
        </div>
        </div>
      </div>
      </div>
      );
    } else {
      return null;
    }
  };
}

const mapStateToProps = state => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price
});

Exchange = connect(mapStateToProps)(Exchange);

export default Exchange;
