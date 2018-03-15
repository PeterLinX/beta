import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import ethLogo from "../img/eth.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from "axios";
import numeral from "numeral";
import fs from "fs";
import TransactionHistoryETH from "./TransactionHistoryETH";
import { ethLoginRedirect } from "../modules/account";
import {  syncEthTransactionHistory, block_index} from "../components/NetworkSwitch";
import { BLOCK_TOKEN } from "../core/constants";

const { dialog } = require("electron").remote;

const getLink = (net, address) => {
    let base = "https://etherscan.io/address/";
    return base + address;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

const saveEthKeyRecovery = ethkeys => {
    const content = JSON.stringify(ethkeys);

    dialog.showSaveDialog(
        {
            filters: [
                {
                    name: "JSON",
                    extensions: ["json"]
                }
            ]
        },
        fileName => {
            if (fileName === undefined) {
                console.log("File failed to save...");
                return;
            }
            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, content, err => {
                if (err) {
                    alert("An error ocurred creating the file " + err.message);
                }
                alert("The file has been succesfully saved");
            });
        }
    );
};


class ReceiveEthereum extends Component {
    constructor(props){
        super(props);

        if(!this.props.ethLoggedIn){
            this.props.dispatch(ethLoginRedirect("/receiveEthereum"));
            this.props.history.push("/newEthereum");
        }
    }

    render() {
        console.log(this.props.net);
        return (
            <div id="" className="">
                <div className="dash-panel">
                    <div className="">
                        <div className="col-xs-8">
                            <img
                                src={ethLogo}
                                alt=""
                                width="32"
                                className="neo-logo logobounce"
                            />
                            <h2>Receive Ethereum (ETH)</h2>
                        </div>

                        <div
                            className="col-xs-1 center top-10 send-info"
                            onClick={() =>
                                refreshBalance(
                                    this.props.dispatch,
                                    this.props.net,
                                    this.props.address
                                )
                            }
                        >
                            <span className="glyphicon glyphicon-refresh font24" />
                        </div>

              <div className="col-xs-3 center">
              <div className="send-panel-price">{numeral(this.props.eth/10000000000).format("0,0.00000")} <span className="eth-price"> ETH</span></div>

            <span className="market-price">{numeral((this.props.eth/10000000000) * this.props.marketETHPrice).format("$0,0.00")} USD</span>
                        </div>


                        <hr className="dash-hr-wide" />
                        <div className="clearboth" />
                        <div className="col-xs-4 top-20">
                            <div
                                className="addressBox-send center animated fadeInDown pointer"
                                data-tip
                                data-for="qraddTip"
                                onClick={() => clipboard.writeText(this.props.ethPubAddr)}
                            >
                                <QRCode size={130} className="neo-qr" value={this.props.ethPubAddr} />
                                <ReactTooltip
                                    className="solidTip"
                                    id="qraddTip"
                                    place="top"
                                    type="light"
                                    effect="solid"
                                >
                                    <span>Click to copy your ETH Address</span>
                                </ReactTooltip>
                            </div>
                        </div>

                        <div className="col-xs-8">
                            <div className="col-xs-12">
                                <h5>Your Ethereum (ETH) Public Address</h5>
                            </div>
                            <div className="col-xs-10 top-10">
                                <input
                                    className="ledger-address font-13"
                                    onClick={() => clipboard.writeText(this.props.ethPubAddr)}
                                    placeholder={'0x' + this.props.ethPubAddr}
                                    value={'0x' + this.props.ethPubAddr}
                                />
                            </div>
                            <div className="col-xs-2 top-10">
                                <Link to={ "/sendETH" }>
                                    <button className="eth-button">
                                        <s
                                        pan className="glyphicon glyphicon-send"/></button>
                                </Link>
                            </div>


                            <div className="clearboth" />
                            <div className="dash-bar">
                                <div
                                    className="dash-icon-bar"
                                    onClick={() => clipboard.writeText(this.props.ethPubAddr)}
                                >
                                    <div className="icon-border">
                                        <span className="glyphicon glyphicon-duplicate" />
                                    </div>
                                    Copy Public Address
                                </div>

                                <div
                                    className="dash-icon-bar"
                                    onClick={() => print()}
                                >
                                    <div className="icon-border">
                                        <span className="glyphicon glyphicon-print" />
                                    </div>
                                    Print Public Address
                                </div>

                                <div
                                    className="dash-icon-bar"
                                    onClick={() =>
                                        openExplorer(getLink(this.props.net, this.props.ethPubAddr))
                                    }
                                >
                                    <div className="icon-border">
                                        <span className="glyphicon glyphicon-link" />
                                    </div>
                                    View On Blockchain
                                </div>

                                <div className="dash-icon-bar"
                                  onClick={() => saveEthKeyRecovery(this.props.wallets)}
                                >
                                    <div className="icon-border">
                                        <span className="glyphicon glyphicon-save" />
                                    </div>
                                    Download Encrypted Key
                                </div>


                            </div>



                        </div>
                    </div>

                    <div className="col-xs-12 top-10">
                        <TransactionHistoryETH />
                    </div>


                    <div className="clearboth" />
                </div>
                <div className="clearboth" />
                <div className="col-xs-12">
                    <p className="send-notice">
                        Sending funds other than Ethereum (ETH) to this address may result in your funds being lost.
                    </p>

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
    eth: state.wallet.Eth,
    marketETHPrice: state.wallet.marketETHPrice,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    ethLoginRedirect: state.account.ethLoginRedirect,
    wallets: state.account.ethAccountKeys
});

ReceiveEthereum = connect (mapStateToProps) (ReceiveEthereum);
export default ReceiveEthereum;
