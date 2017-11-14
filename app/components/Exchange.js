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

        <div className="progress-bar fadeInLeft-ex"></div>
          <div className="row prog-info top-20">
          <div className="col-xs-2 col-xs-offset-1 sm-text center">
          Enter Amount to Deposit
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Placing Your Order
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Generating Bitcoin Address for Deposit
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Processing Your Order
          </div>
          <div className="col-xs-2 sm-text center grey-out">
          Transaction Complete!
          </div>
        </div>

        <div className="top-130 ">
        <div className="settings-panel fadeInDown">

        <div className="row fadeInDown">

        <div className="col-xs-4 col-xs-offset-1">
        <div className="exch-logos"><BtcLogo width={40} /></div>
        <h4 className="top-20">Deposit BTC</h4>
        </div>

        <div className="col-xs-4  col-xs-offset-2">
        <div className="exch-logos"><NeoLogo width={40} /></div>
        <h4 className="top-20">NEO Received</h4>
        </div>

          <div className="col-xs-4 center col-xs-offset-1">
            <input className="form-control-exchange center" placeholder="0.00000000" disabled />
          </div>

          <div className="col-xs-2 center">
            <div className="exchange-glyph">
            <span className="glyphicon glyphicon-refresh" />
            </div>
          </div>

          <div className="col-xs-4 center">
          <input className="form-control-exchange center" placeholder="0" disabled />
          </div>

        </div>

        <div className="row">
          <div className="col-xs-10 center col-xs-offset-1  top-20">
          <input className="form-control-exchange center" disabled placeholder="AG3p13w3b1PT7UZtsYBoQrt6yjjNhPNK8b" />
          <p className="sm-text">Once complete, NEO will be deposited to the address above</p>
          </div>
        </div>
        <div className="row top-20">
        <div className="col-xs-3 col-xs-offset-1 sm-text">
        1 BTC = NaN NEO<br />
        1 NEO = $NaN USD<br />
        Subject to trasnsaction fees
        </div>
        <div className="col-xs-4 center">
        <button className="grey-button">Continue</button>
        </div>
        <div className="col-xs-3">
        <p className="sm-text">Powered by:</p>
        <div className="changelly-logo"></div>
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
