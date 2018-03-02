import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory ,syncBtcTransactionHistory, block_index} from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import Claim from "./Claim";
import TopBar from "./TopBar";
import { initiateBtcGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import bitcoinLogo from "../img/btc-logo.png";

// TODO: make this a user setting
const getBtcExplorerLink = (net, txid) => {
  let base;
  if ( net === "MainNet") {
      base = "https://live.blockcypher.com/btc/tx/"
  } else {
      base = "https://live.blockcypher.com/btc-testnet/tx/"
  }

  return base + txid;
};

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

const refreshBalance = (dispatch, net, btc_address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateBtcGetBalance(dispatch, net, btc_address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class TransactionHistoryBTC extends Component {
  componentDidMount = () => {
      syncBtcTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.btc_address
    );
  };

  render = () => (
    <div id="send">
      <div className="dash-panel fadeInDown">
        <div className="row">
          <div className="col-xs-9">
          <img
            src={bitcoinLogo}
            alt=""
            width="45"
            className="neo-logo fadeInDown"
          />
            <h2>Bitcoin Transaction History</h2>
          </div>
          <div
            className="col-xs-3 center top-10 send-info"
            onClick={() =>
              refreshBalance(
                this.props.dispatch,
                this.props.net,
                this.props.btc_address
              )
            }
          >
            <span className="glyphicon glyphicon-refresh marg-right-5" /> Block:{" "}
            {this.props.blockIndex}
          </div>
          <div className="col-xs-12">
            <hr className="dash-hr-wide" />
          </div>
          <ul id="transactionList">
            {this.props.btc_transactions.map(t => {
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
                          getBtcExplorerLink(
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
  blockIndex: state.metadata.block_index,
  address: state.account.address,
  btc_address: state.account.btcPubAddr,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  btc_transactions: state.wallet.btc_transactions,
  explorer: state.metadata.blockExplorer
});

TransactionHistoryBTC = connect(mapStateToProps)(TransactionHistoryBTC);

export default TransactionHistoryBTC;
