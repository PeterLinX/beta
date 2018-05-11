import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { shell, clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";

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

class ViewAddress extends Component {
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

            <div className="col-xs-12">
            <h2 className="">Copy NEO/NEP Encrypted Keys</h2>
            </div>

            <div className="col-xs-12 center fadeInDown">
            <hr className="dash-hr-wide" />
            </div>

            <div className="clearboth" />

            <div className="row top-30 settings-padding">

            <div className="settingsItem">
              <div className="walletList">
              {_.map(this.props.wallets, (value, key) => {
                return (
                  <div className="">
                    <div className="walletItem">
                      <div className="walletName">{key.slice(0, 20)}</div>
                      <div className="walletKey">
                      <input className="form-send-white" value={value} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
            <div className="clearboth" />
            </div>
            <div className="clearboth" />
          </div>
          <div className="clearboth" />
        </div>
        <div className="clearboth" />
        </div>
      <div className="clearboth" />
      <div className="send-notice">
        <p>
          WARNING! Please backup your saved encrypted keys and/or private keys before removing saved addresses from Morpheus. This action can only be undone if you have exported your saved addresses.
        </p>
    </div>
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

ViewAddress = connect(mapStateToProps)(ViewAddress);

export default ViewAddress;
