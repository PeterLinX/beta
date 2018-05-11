import React, { Component } from "react";
import { connect } from "react-redux";
import { syncLtcTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import { initiateLtcGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

// TODO: make this a user setting
const getLtcExplorerLink = (net, txid) => {
  let base;
  if ( net === "MainNet") {
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

const refreshBalance = (dispatch, net, ltc_address) => {
  dispatch(sendEvent(true, "Refreshing the LTC blockchain may take 5 minutes or more. Please wait..."));
  initiateLtcGetBalance(dispatch, net, ltc_address).then(response => {
    dispatch(sendEvent(true, "Your LTC transaction history and availabe funds have been updated."));
    setTimeout(() => dispatch(clearTransactionEvent()), 4000);
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
        <div className="row">
        <div className="col-xs-12">
          <span className="glyphicon glyphicon-list-alt float-left marg-right-10 top-20" />
          <h3>Litecoin Transaction History</h3>
          <hr className="dash-hr-wide" />
          <ul id="BTCtransactionList">
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
                          getLtcExplorerLink(
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
