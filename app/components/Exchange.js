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
import { Link } from "react-router";
import crypto from "crypto";
import axios from "axios";
import Changelly from "../modules/changelly";

// force sync with balance data
// const refreshBalance = (dispatch, net, address) => {
//   dispatch(sendEvent(true, "Refreshing..."));
//   initiateGetBalance(dispatch, net, address).then(response => {
//     dispatch(sendEvent(true, "Received latest blockchain information."));
//     setTimeout(() => dispatch(clearTransactionEvent()), 1000);
//   });
// };

const apiUrl = "https://api.changelly.com";
const apiKey = "1befd82a2ef24c359c3106f96b5217c0";
const secret =
  "eeea2b75ae6a627e69bd39a0de64675a2b0a414b0b9a9513355ba9e30eb6cb2f";

let changelly = new Changelly(apiKey, secret);

class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      from: "btc",
      to: "neo",
      fromValue: 0,
      toValue: 0
    };
  }

  // componentDidMount = () => {
  //   initiateGetBalance(this.props.dispatch, this.props.net, this.props.address);
  //   QRCode.toCanvas(this.canvas, this.props.address, { version: 5 }, err => {
  //     if (err) console.log(err);
  //   });
  // };

  async componentDidMount() {
    changelly.getMinAmount("btc", "neo", function(err, data) {
      if (err) {
        console.log("Error!", err);
      } else {
        console.log("getMinAmount", data);
        this.setState({ fromValue: data.result });
      }
    });
  }

  async onChangeFrom() {}

  render = () => {
    // if (this.props.address != null) {
    return (
      <div>
        <TopBar />

        <div className="progress-bar fadeInLeft-ex" />
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

        <div className="top-130">
          <div className="settings-panel fadeInDown">
            <div className="com-soon row fadeInDown">
              <div className="col-xs-4 col-xs-offset-1">
                <div className="exch-logos">
                  <BtcLogo width={40} />
                </div>
                <h4 className="top-20">Deposit BTC</h4>
              </div>

              <div className="col-xs-4  col-xs-offset-2">
                <div className="exch-logos">
                  <NeoLogo width={40} />
                </div>
                <h4 className="top-20">NEO Received</h4>
              </div>

              <div className="col-xs-4 center col-xs-offset-1">
                <input
                  className="form-control-exchange center"
                  placeholder="0.00000000"
                  value={this.state.fromValue}
                  type="number"
                />
              </div>

              <div className="col-xs-2 center">
                <div className="exchange-glyph">
                  <span className="glyphicon glyphicon-refresh" />
                </div>
              </div>

              <div className="col-xs-4 center">
                <input
                  className="form-control-exchange center"
                  value={this.state.toValue}
                  placeholder="0"
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-10 center col-xs-offset-1  top-20">
                <input
                  className="form-control-exchange center"
                  disabled
                  placeholder={"AW3yE1mreqYMuvFZerut2M9yKDr8yBN6WK"}
                />
                <p className="sm-text">
                  Once complete, NEO will be deposited to the address above
                </p>
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
                <div className="changelly-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // } else {
    //   return null;
    // }
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
