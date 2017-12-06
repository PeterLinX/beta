import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import Claim from "./Claim";
import TopBar from "./TopBar";

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

class TransactionHistory extends Component {
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
          <div className="col-xs-12">
            <h2 className="center">Transaction History</h2>
            <hr className="" />
          </div>

          <ul id="transactionList">
            {this.props.transactions.map(t => {
              const formatGas = gas =>
                Math.floor(parseFloat(gas) * 10000) / 10000;
              let formatAmount =
                t.type === "NEO" ? parseInt(t.amount) : formatGas(t.amount);
              return (
                <li key={t.txid}>
                  <div
                    className="col-xs-10"
                    onClick={() =>
                      openExplorer(
                        getExplorerLink(
                          this.props.net,
                          this.props.explorer,
                          t.txid
                        )
                      )
                    }
                  >
                    {t.txid.substring(0, 32)}...{" "}
                    <span className="glyphicon glyphicon-link" />
                  </div>
                  <div className="col-xs-2">
                    {formatAmount} {t.type}
                  </div>
                </li>
              );
            })}
          </ul>
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

TransactionHistory = connect(mapStateToProps)(TransactionHistory);

export default TransactionHistory;
