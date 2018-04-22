import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { shell, clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import Delete from "react-icons/lib/md/delete";

import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import ReactTooltip from "react-tooltip";

import { setBlockExplorer } from "../modules/metadata";
import { setKeys } from "../modules/account";
import { NetworkSwitch } from "../components/NetworkSwitch";
import { syncTransactionHistory } from "../components/NetworkSwitch";

import Logo from "./Brand/LogoBlank";
import NeoLogo from "./Brand/Neo";
import Claim from "./Claim";
import TopBar from "./TopBar";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";

let explorer_select;

const { dialog } = require("electron").remote;
const saveKeyRecovery = keys => {
  const content = JSON.stringify(keys);
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

const loadKeyRecovery = dispatch => {
  dialog.showOpenDialog(fileNames => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log("No file selected");
      return;
    }
    const filepath = fileNames[0];
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }
      const keys = JSON.parse(data);
      storage.get("keys", (error, data) => {
        _.each(keys, (value, key) => {
          data[key] = value;
        });
        dispatch(setKeys(data));
        storage.set("keys", data);
      });
    });
  });
};

const saveSettings = settings => {
  storage.set("settings", settings);
};

const loadSettings = dispatch => {
  storage.get("settings", (error, settings) => {
    if (
      settings.blockExplorer !== null &&
      settings.blockExplorer !== undefined
    ) {
      dispatch(setBlockExplorer(settings.blockExplorer));
    }
  });
};

const updateSettings = dispatch => {
  saveSettings({ blockExplorer: explorer_select.value });
  dispatch(setBlockExplorer(explorer_select.value));
};

const deleteWallet = (dispatch, key) => {
  storage.get("keys", (error, data) => {
    delete data[key];
    storage.set("keys", data);
    dispatch(setKeys(data));
  });
};

const getLink = (net, address) => {
  let base;
  if (net === "MainNet") {
    base = "https://neotracker.io/address/";
  } else {
    base = "https://testnet.neotracker.io/address/";
  }
  return base + address;
};

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Settings extends Component {
  componentDidMount = () => {
    storage.get("keys", (error, data) => {
      this.props.dispatch(setKeys(data));
    });
    syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
    loadSettings(this.props.dispatch);
  };

  render = () => (
    <div id="send">
      <div className="dash-panel ">
        <div className="description">

          <div className="row">

            <div className="col-xs-6">
            <h2 className="">General Settings</h2>
            </div>


            <div className="col-xs-6">

            <ul className="social-bar">
            <li
            onClick={() =>
                    openExplorer("https://morpheuswallet.com")
            }
            ><span className="glyphicon glyphicon-globe"/> Website</li>
            <li
            onClick={() =>
                    openExplorer("https://github.com/MorpheusWallet/beta/releases")
            }
            ><img src={gitsmLogo} alt="" width="16" className="" /> Github</li>
            <li
            onClick={() =>
                    openExplorer("https://twitter.com/morpheuswallet")
            }
            ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
            </ul>
          </div>




            <div className="col-xs-12 center">
            <hr className="dash-hr-wide" />
            </div>

            <div className="clearboth" />

            <div className="row top-30 settings-padding">

              <div className="col-xs-2 center">
                <NetworkSwitch />
              </div>

              <div className="col-xs-2 center">
                <Link to="/">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-user" />
                    </div>
                    Open Saved Address
                  </div>
                </Link>
              </div>


              <div className="col-xs-2 center">
                <Link to="/support">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-info-sign" />
                    </div>
                    Support & FAQs
                  </div>
                </Link>
              </div>

              <Link to="/LoginLedgerNanoS"
              onClick={() => dispatch(logout())}
              >
              <div className="col-xs-2 center">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <div className="ledger-sm" />
                  </div>
                  Login with Ledger
                </div>
              </div>
              </Link>

              <div
                className="col-xs-2 center"
                onClick={() => dispatch(logout())}
              >
                <Link to="/create">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <div className="neo-icon" />
                    </div>
                    Create New Address
                  </div>
                </Link>
              </div>


              <div className="col-xs-2 center">
                <div
                  className="dash-icon-bar"
                  onClick={() =>
                          openExplorer("https://github.com/MorpheusWallet/beta/releases")
                  }
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-bell" />
                  </div>
                  Check for Update
                </div>
              </div>


              </div>




            <div className="row top-20 settings-padding fadeInDown">



              <div className="col-xs-2 center">
                <div
                  className="dash-icon-bar"
                  onClick={() => saveKeyRecovery(this.props.wallets)}
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-save" />
                  </div>
                  Export NEO Keys
                </div>
              </div>

              <div className="col-xs-2 center">
                <div
                  className="dash-icon-bar"
                  onClick={() => loadKeyRecovery(this.props.dispatch)}
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-open" />
                  </div>
                  Upload Wallet Backup
                </div>
              </div>



              <div className="col-xs-2 center">
                <Link to="/encryptKey">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-qrcode" />
                    </div>
                    Encrypt a Private Key
                  </div>
                </Link>
              </div>



              <div className="col-xs-2 center">
                <div
                  className="dash-icon-bar"
                  onClick={() =>
                    openExplorer(getLink(this.props.net, this.props.address))
                  }
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-link" />
                  </div>
                  View on NeoTracker
                </div>
              </div>

              <div className="col-xs-2 center">
                <Link to="/"
                onClick={() => dispatch(logout())}
                >
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-remove" />
                    </div>
                    Log Out of Address
                  </div>
                </Link>
              </div>

              <div className="col-xs-2 center">
                <Link to="/advancedBitcoin" >
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-bitcoin" />
                    </div>
                    Bitcoin Options
                  </div>
                </Link>
              </div>

              </div>

            <div className="row top-20 settings-padding fadeInDown">

              <div className="col-xs-2 center">
              <Link to="removeAddress">
                <div
                  className="warning dash-icon-bar"
                >
                  <div className="warning icon-border">
                    <span className="warning glyphicon glyphicon-trash" />
                  </div>
                  Remove Saved Addresses
                </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
        </div>
      <div className="clearboth" />
    </div>
  );
}

const mapStateToProps = state => ({
  explorer: state.metadata.blockExplorer,
  wallets: state.account.accountKeys,
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions
});

Settings = connect(mapStateToProps)(Settings);

export default Settings;
