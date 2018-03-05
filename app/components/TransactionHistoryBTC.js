import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory ,syncBtcTransactionHistory, block_index} from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import { initiateBtcGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { Accordion, AccordionItem } from "react-sanfona";

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
  dispatch(sendEvent(true, "Refreshing the BTC blockchain may take 5 minutes or more. Please wait..."));
  initiateBtcGetBalance(dispatch, net, btc_address).then(response => {
    dispatch(sendEvent(true, "Your BTC transaction history and availabe funds have been updated."));
    setTimeout(() => dispatch(clearTransactionEvent()), 4000);
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
        <div className="row">
        <div className="col-xs-12 top-20">
          <span className="glyphicon glyphicon-list-alt float-left marg-right-10" /> <Accordion>
          <AccordionItem title="Bitcoin Transaction History" titleClassName="menu-accord-item">
          <hr className="dash-hr-wide" />
          <ul id="BTCtransactionList">
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

          </AccordionItem>
            </Accordion>


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
