import React, { Component } from "react";
import { connect } from "react-redux";
import { syncEosTransactionHistory, block_index} from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import { initiateEosGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { Accordion, AccordionItem } from "react-sanfona";
import { ETHERIO_TOKEN } from "../core/constants";
import numeral from "numeral";

const getEthExplorerLink = (txid) => {
    let base = "https://etherscan.io/tx/" + txid;
    return base;
}

// helper to open an external web link
const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

const refreshBalance = (dispatch, net, eth_address) => {
    dispatch(sendEvent(true, "Refreshing the EOS blockchain may take 5 minutes or more. Please wait..."));
    initiateEosGetBalance(dispatch, net, eth_address).then(response => {
        dispatch(sendEvent(true, "Your EOS transaction history and availabe funds have been updated."));
        setTimeout(() => dispatch(clearTransactionEvent()), 4000);
    });
};

class TransactionHistoryEOS extends Component {
    componentDidMount = () => {
        syncEosTransactionHistory(
            this.props.dispatch,
            this.props.net,
            this.props.eth_address
        );
    };

    render = () => (
        <div id="send">
            <div className="row">
                <div className="col-xs-12 top-20">
                    <span className="glyphicon glyphicon-list-alt float-left marg-right-10" /> <Accordion>
                    <AccordionItem expanded={true} title="EOS.io Transaction History"  ClassName="menu-accord-item">
                        <hr className="dash-hr-wide" />
                        <ul id="BTCtransactionList">
                            {this.props.eos_transactions.map(t => {
                                const formatGas = gas =>
                                    Math.floor(parseFloat(gas));
                                let formatAmount =
                                    t.type === "NEO" ? parseInt(t.amount) : formatGas(t.amount);
                                return (
                                    <li key={t.txid}>
                                        <div
                                            className="col-xs-9 support-qs"
                                            onClick={() =>
                                                openExplorer(
                                                    getEthExplorerLink(
                                                        t.txid
                                                    )
                                                )
                                            }
                                        >
                                            <span className="glyphicon glyphicon-link marg-right-5" />
                                            {t.txid.substring(0, 64)}{" "}
                                        </div>
                                        <div className="col-xs-3 center font-16">
                                            {numeral(formatAmount/10).format("0,0.0000")} {t.type}

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
    eth_address: state.account.ethPubAddr,
    net: state.metadata.network,
    neo: state.wallet.Neo,
    gas: state.wallet.Gas,
    price: state.wallet.price,
    eos_transactions: state.wallet.eos_transactions,
    explorer: state.metadata.blockExplorer
});

TransactionHistoryEOS = connect(mapStateToProps)(TransactionHistoryEOS);
export default TransactionHistoryEOS;
