import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import MdSync from "react-icons/lib/md/sync";
import QRCode from "qrcode";
import Charts from "./Charts.js";
import Assets from "./Assets.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";

class WalletInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    initiateGetBalance(this.props.dispatch, this.props.net, this.props.address ,this.props.btc ,this.props.ltc ,this.props.eth);
    QRCode.toCanvas(this.canvas, this.props.address, { version: 5 }, err => {
      if (err) console.log(err);
    });
  };

  render = () => {
    if (this.props.address != null) {
      return (
        <div>
          <Assets />
          <Charts />
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
  price: state.wallet.price,
  btcPubAddr: state.account.btcPubAddr,
  ltcPubAddr: state.account.ltcPubAddr,
  ethPubAddr: state.account.ethPubAddr,
  btc: state.wallet.Btc,
  ltc: state.wallet.Ltc,
  eth: state.wallet.Eth
});

WalletInfo = connect(mapStateToProps)(WalletInfo);

export default WalletInfo;
