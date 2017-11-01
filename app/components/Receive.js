import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import neoLogo from "../images/neo.png";
import copyIcon from "../images/copy-icon.png";
import printIcon from "../images/print-icon.png";
import emailIcon from "../images/email-icon.png";
import linkIcon from "../images/link-icon.png";
import TopBar from "./TopBar";

class Receive extends Component {
  render() {
    return (
      <div id="receive" className="">
        <TopBar />
        <div className="row top-20">
          <h2>Receive NEO/GAS</h2>
          <div className="addressBox-send center">
            <QRCode size={180} value={this.props.address} />
          </div>
          <div className="row">
            <p className="address">{this.props.address}</p>
            <p className="info">Send NEO or GAS to this address ONLY.</p>

            <div className="dash-bar-rec top-20">
              <div
                className="dash-icon-bar"
                onClick={() => clipboard.writeText(this.props.address)}
              >
                <div className="icon-border">
                  <span className="glyphicon glyphicon-duplicate" />
                </div>
                Copy Public Address
              </div>

              <div className="dash-icon-bar" onClick={() => print()}>
                <div className="icon-border">
                  <span className="glyphicon glyphicon-print" />
                </div>
                Print Paper Wallet
              </div>

              <div className="dash-icon-bar">
                <div className="icon-border">
                  <span className="glyphicon glyphicon-link" />
                </div>
                View On Blockchain
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  net: state.metadata.network,
  address: state.account.address,
  neo: state.wallet.Neo,
  price: state.wallet.price,
  gas: state.wallet.Gas
});

Receive = connect(mapStateToProps)(Receive);
export default Receive;
