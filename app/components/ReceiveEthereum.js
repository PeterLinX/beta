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
import { BLOCK_TOKEN } from "../core/constants";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

const { dialog } = require("electron").remote;

const getLink = (net, address) => {
    let base = "https://etherscan.io/address/";
    return base + address;
};


const refreshBalance = (dispatch, net, address, eth_address) => {
  dispatch(sendEvent(true, "Refreshing the Litecoin blockchain may take up to 5 minutes or more. Click Morpheus logo to cancel."));
  initiateGetBalance(dispatch, net, address, eth_address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
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
            this.props.dispatch(ethLoginRedirect("/sendETH"));
            this.props.history.push("/newEthereum");
        }
    }

    render() {
        console.log(this.props.net);
        return (
            <div>
                        <div className="col-xs-8 col-xs-offset-2">
                            <div
                                className="addressBox-send center animated fadeInDown pointer"
                                data-tip
                                data-for="qraddTip"
                                onClick={() => clipboard.writeText('0x' + this.props.ethPubAddr)}
                            >
                                <QRCode size={130} className="neo-qr" value={'0x' + this.props.ethPubAddr} />
                                <ReactTooltip
                                    className="solidTip"
                                    id="qraddTip"
                                    place="top"
                                    type="light"
                                    effect="solid"
                                >
                                    <span>Click to copy your Ethereum Address</span>
                                </ReactTooltip>
                            </div>
                        </div>
                        <div className="clearboth" />
                        <div className="col-xs-10 col-xs-offset-1  top-10">
                                <textarea
                                    className="ledger-address font-13"
                                    placeholder={'0x' + this.props.ethPubAddr}
                                    value={'0x' + this.props.ethPubAddr}
                                />
                        </div>

                        <div className="clearboth" />


                        <div className="dash-bar-rec">

                                <div
                                    className="dash-icon-bar"
                                    onClick={() => clipboard.writeText('0x' + this.props.ethPubAddr)}
                                >
                                    <div className="icon-border">
                                        <span className="glyphicon glyphicon-duplicate" />
                                    </div>
                                    Copy Public Address
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
    eth_address:state.account.ethPubAddr,
    marketETHPrice: state.wallet.marketETHPrice,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    ethLoginRedirect: state.account.ethLoginRedirect,
    wallets: state.account.ethAccountKeys
});

ReceiveEthereum = connect (mapStateToProps) (ReceiveEthereum);
export default ReceiveEthereum;
