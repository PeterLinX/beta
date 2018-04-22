import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import elastosLogo from "../img/ela.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import fs from "fs";
import TransactionHistoryELA from "./TransactionHistoryELA";
import {  block_index} from "../components/NetworkSwitch";
import { elaLoginRedirect } from "../modules/account";
import { setMarketPrice, resetPrice } from "../modules/wallet";
import { initiateElaGetBalance, intervals } from "../components/NetworkSwitch";
import numeral from "numeral";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

const { dialog } = require("electron").remote;
const getLink = (net, address) => {
    let base;
    if (net === "MainNet") {
        base = "https://blockchain.elastos.org/address/";
    } else {
        base = "https://blockchain.elastos.org/address/";
    }
    return base + address;
};


const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

const saveElaKeyRecovery = elakeys => {
    const content = JSON.stringify(elakeys);
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

class ReceiveElastos extends Component {

    constructor(props){
        super(props);

        if(!this.props.elaLoggedIn){
            this.props.dispatch(elaLoginRedirect("/sendELA"));
            this.props.history.push("/newElastos");
        }
    }

    render() {
        console.log(this.props.net);
        return (
          <div>

          <div className="col-xs-8 col-xs-offset-2">
          <div className="addressBox-send center animated fadeInDown pointer"
              data-tip
              data-for="qraddTip"
              onClick={() =>
                clipboard.writeText(this.props.elaPubAddr)
          } >
        <QRCode size={150} className="neo-qr" value={this.props.elaPubAddr} />
        <ReactTooltip
               className="solidTip"
               id="qraddTip"
               place="top"
               type="light"
               effect="solid"
        >
          <span>Click to copy your Elastos Address</span>
            </ReactTooltip>
            </div>
          </div>
          <div className="clearboth" />

             <div className="col-xs-12">
              <input
               className="ledger-address top-10"
               onClick={() => clipboard.writeText(this.props.elaPubAddr)}
               id="center"
               placeholder={this.props.address}
               value={this.props.elaPubAddr} />
            </div>


               <div className="clearboth" />

               <div className="dash-bar-rec top-10">

              <div className="dash-icon-bar"
               onClick={() => clipboard.writeText(this.props.elaPubAddr)} >
               <div className="icon-border">
                   <span className="glyphicon glyphicon-duplicate" />
               </div>
               Copy Public Address
              </div>

              <div
               className="dash-icon-bar"
               onClick={() =>
               openExplorer(getLink(this.props.net, this.props.elaPubAddr))} >
               <div className="icon-border">
                   <span className="glyphicon glyphicon-link" />
               </div>
               View On Blockchain
             </div>

              <div className="dash-icon-bar"
                onClick={() => saveElaKeyRecovery(this.props.wallets)}>
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
    ela: state.wallet.Ela,
    ela_address: state.account.elaPubAddr,
    ela_wif: state.account.elaPrivKey,
    marketELAPrice: state.wallet.marketELAPrice,
    elaLoggedIn: state.account.elaLoggedIn,
    elaPrivKey: state.account.elaPrivKey,
    elaPubAddr: state.account.elaPubAddr,
    wallets: state.account.elaAccountKeys
});

ReceiveElastos = connect(mapStateToProps)(ReceiveElastos);
export default ReceiveElastos;
