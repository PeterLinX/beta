import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import bitcoinLogo from "../img/btc-logo.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setBtcBalance } from '../modules/wallet'
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { btcLogIn, btcLoginRedirect } from '../modules/account';
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import { setBtcBlockHeight } from "../modules/metadata";


const getBtcExplorerLink = (net, txid) => {
    let base;
    if ( net === "MainNet") {
        base = "https://live.blockcypher.com/btc/tx/"
    } else {
        base = "https://live.blockcypher.com/btc-testnet/tx/"
    }
    return base + txid;
};

const getBalanceLink = (net, address) => {
    let url;

    if (net === "MainNet") {
        url = 'https://blockexplorer.com/api/addr/' + address + '/balance';
    } else {
        url = 'https://testnet.blockexplorer.com/api/addr/' + address + '/balance';
    }
    return url;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};


class SweepInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus: false
        };
    }

    render() {
        return (
            <div>
                <div className=" dash-panel top-20">
                    <h2>Transfer Detials</h2>

                    <hr className="dash-hr-wide top-20" />

                    <div className="clearboth" />
                    <div className="col-xs-3 top-20">
                    <h4>Transaction Id:</h4>
                    </div>
                    <div className="col-xs-9 top-20">
                        <input className="form-send-white" id="results" onClick={()=>openExplorer(getBtcExplorerLink(this.props.net,this.props.routeParams.txid))} value={this.props.routeParams.txid} placeholder={this.props.routeParams.txid}/>
                    </div>
                    <div className="clearboth" />
                </div>

                <div className="clearboth" />

                <div className="col-xs-12 center top-30">
                  <hr className="dash-hr-wide" />
                </div>

                <div className="col-xs-2">
                <Link to="/sendBTC">
                <div className="grey-button">Back</div>
                </Link>
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
    gas: state.wallet.Gas,
    wif: state.account.wif,
    btc: state.wallet.Btc,
    btcLoggedIn: state.account.btcLoggedIn,
    btcPrivKey: state.account.btcPrivKey,
    btcPubAddr: state.account.btcPubAddr,
    btcLoginRedirect: state.account.btcLoginRedirect,
});

SweepInfo = connect(mapStateToProps)(SweepInfo);
export default SweepInfo;
