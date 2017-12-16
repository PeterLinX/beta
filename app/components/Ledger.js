import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import MdSync from "react-icons/lib/md/sync";
import QRCode from "qrcode";
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

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class Ledger extends Component {
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

        <div className="top-50 ">
        <div className="ledger-nanos fadeInDown"></div>
        <div className="settings-panel fadeInDown">
        <div className="col-xs-12">
          <div className="col-xs-9">
          <h4 className="top-20">Transfer NEO/GAS from Moprheus</h4>
          <input className="form-control-exchange center top-10" placeholder={this.props.address} />
          </div>

          <div className="col-xs-3">
          <input className="form-control-exchange center top-55" placeholder="0" />
          </div>
        </div>

          <div className="col-xs-12">
          <div className="col-xs-9">
          <h4 className="">To my Ledger Nano S</h4>
          <input className="form-control-exchange center top-10" placeholder="Device not connected. Please check."/>
          </div>
          <div className="col-xs-3 top-55">
          <button className="grey-button">Send</button>
          </div>
        </div>
<div className="clearboth" />
          </div>
          <div className="clearboth" />
          <div className="col-xs-offset-2 col-xs-8">
          <p className="center top-20">Please ensure your device is connected to your computer, unlocked and you have opened the NEO application on your Ledger Nano S.</p>
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

Ledger = connect(mapStateToProps)(Ledger);

export default Ledger;
