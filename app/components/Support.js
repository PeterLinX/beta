import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import Claim from "./Claim";
import TopBar from "./TopBar";
import gitHub from "../images/github.png";
import disCord from "../images/disCord.png";
import neoNews from "../images/neoNews.png";

// TODO: make this a user setting
const getExplorerLink = (net, explorer, txid) => {
  let base;
  if (explorer === "Neotracker") {
    if (net === "MainNet") {
      base = "https://neotracker.io/tx/";
    } else {
      base = "https://testnet.neotracker.io/tx/";
    }
  } else {
    if (net === "MainNet") {
      base = "http://antcha.in/tx/hash/";
    } else {
      base = "http://testnet.antcha.in/tx/hash/";
    }
  }
  return base + txid;
};

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Support extends Component {
  componentDidMount = () => {
    syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
  };

  render = () => (
    <div id="send">
    <TopBar />
      <div className="send-neo fadeInDown">
        <div className="row">
          <div className="col-xs-4 center send-info">
          <img
            src={gitHub}
            alt=""
            width="200"
            className="support-hov"
          />
          <p className="com-soon support-hov">View on Github</p>
          </div>
          <div className="col-xs-4 center send-info">
          <img
            src={disCord}
            alt=""
            width="200"
            className="support-hov"
          />
          <p className="com-soon support-hov">Join the Discord</p>
          </div>
          <div className="col-xs-4 center send-info">
          <img
            src={neoNews}
            alt=""
            width="200"
            className="support-hov"
          />
          <p className="com-soon support-hov">Latest NEO News</p>
          </div>

          <div className="col-xs-12 top-10">
          <h3 className="">Frequently Asked Questions</h3>
          </div>

          <div className="support">
          <div className="col-xs-12 top-10">
          How do I export my ecrypted key from Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          How do I ecrypted an existing private key in Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          How do I exchange Bitcoin (BTC) for NEO in Morpheus using Changelly?
          </div>

          <div className="col-xs-12 top-10">
          How do I deposit to and withdraw from my Ledger Nano S using Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          How do I claim GAS on my Ledger Nano S using Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          How do I remove my address from Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          How do I switch between sending NEO or GAS?
          </div>

          <div className="col-xs-12 top-10">
          Can I use the NEO address created with Morpheus with other NEO wallets?
          </div>

          <div className="col-xs-12 top-10">
          Can I use a NEO address created with NEON with Morpheus?
          </div>

          <div className="col-xs-12 top-10">
          Can I use a NEO address created with NEON with Morpheus?
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions,
  explorer: state.metadata.blockExplorer
});

Support = connect(mapStateToProps)(Support);

export default Support;
