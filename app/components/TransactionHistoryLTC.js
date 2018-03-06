import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { syncLtcTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import Claim from "./Claim";
import TopBar from "./TopBar";
import { initiateLtcGetBalance, intervals,initiateGetBalance } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import litecoinLogo from "../img/litecoin.png";

// TODO: make this a user setting
const getExplorerLink = (net, txid) => {
  let base;

  if (net === "MainNet") {
      base = "https://live.blockcypher.com/ltc/tx/"
  } else {
      base = "https://live.blockcypher.com/ltc-testnet/tx/"
  }
  return base + txid;
};

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

const refreshBalance = (dispatch, net, address, btc_address, ltc_address) => {
  dispatch(sendEvent(true, "Refreshing..."));
    initiateGetBalance(dispatch, net, address, btc_address, ltc_address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class TransactionHistoryLTC extends Component {
  componentDidMount = () => {
      syncLtcTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.ltc_address
    );
  };

  render = () => (
    <div id="send">
      <div className="dash-panel fadeInDown">
        <div className="row">
          <div className="col-xs-9">
          <img
            src={litecoinLogo}
            alt=""
            width="45"
            className="neo-logo fadeInDown"
          />
            <h2>Litecoin Transaction History</h2>
          </div>
          <div
            className="col-xs-3 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.address,
                this.props.btc_address,
                this.props.ltc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh marg-right-5" /> Block:{" "}
            {this.props.blockHeight}
          </div>
          <div className="col-xs-12">
            <hr className="dash-hr-wide" />
          </div>
          <ul id="transactionList">
            {this.props.ltc_transactions.map(t => {
              const formatGas = gas =>
                Math.floor(parseFloat(gas) * 10000) / 10000;
              let formatAmount =
                t.type === "NEO" ? parseInt(t.amount) : formatGas(t.amount);
              return (
                <li key={t.txid}>
                  <div
                    className="col-xs-9 support-qs"
                    onClick={() =>
                      openExplorer(
                        getExplorerLink(
                          this.props.net,
                          t.txid
                        )
                      )
                    }
                  >
                    <span className="glyphicon glyphicon-link marg-right-5" />
                    {t.txid.substring(0, 64)}{" "}
                  </div>
                  <div className="col-xs-3 center font-16">
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
  btc_address: state.account.btcPubAddr,
  ltc_address: state.account.ltcPubAddr,
  ltc_transactions: state.wallet.ltc_transactions,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions,
  explorer: state.metadata.blockExplorer
});

TransactionHistoryLTC = connect(mapStateToProps)(TransactionHistoryLTC);

export default TransactionHistoryLTC;
