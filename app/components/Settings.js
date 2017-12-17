import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { setBlockExplorer } from "../modules/metadata";
import { setKeys } from "../modules/account";
import Delete from "react-icons/lib/md/delete";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import Logo from "./Brand/LogoBlank";
import NeoLogo from "./Brand/Neo";
import Claim from "./Claim";
import { NetworkSwitch } from "../components/NetworkSwitch";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import TopBar from "./TopBar";

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

const getExplorerLink = (net, explorer, txid) => {
  let base;
  if (explorer === "Neotracker") {
    if (net === "MainNet") {
      base = "https://neotracker.io/tx/";
    } else {
      base = "https://testnet.neotracker.io/tx/";
    }
  } else {
    if (net === "MainNet") {
      base = "http://antcha.in/tx/hash/";
    } else {
      base = "http://testnet.antcha.in/tx/hash/";
    }
  }
  return base + txid;
};

// helper to open an external web link
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
      <TopBar />
      <div className="settings-panel top-50 fadeInDown">
        <div className="description">
          <div className="row">
            <h2 className="center">General Settings</h2>
            <div className="col-xs-10 center col-xs-offset-1">
              <hr className="" />
            </div>
            <div className="clearboth" />
            <div className="row">
              <div className="col-xs-2 center col-xs-offset-1">
                <NetworkSwitch />
              </div>
              <div
                className="col-xs-2 center "
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
                <Link to="/LoginLocalStorage">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-user" />
                    </div>
                    Open a Saved Address
                  </div>
                </Link>
              </div>
              <div className="col-xs-2 center">
              <Link to="/trade">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-signal" />
                  </div>
                  Pro Trading Charts
                </div>
                </Link>
              </div>
              <div className="col-xs-2 center">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-file" />
                  </div>
                  Legal Displaimer & Privacy
                </div>
              </div>
            </div>
            <div className="row top-20">
              <div className="col-xs-2 center col-xs-offset-1 ">
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
                  onClick={() => saveKeyRecovery(this.props.wallets)}
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-save" />
                  </div>
                  Export My Encrypted Keys
                </div>
              </div>
              <div className="col-xs-2 center">
                <div
                  className="dash-icon-bar"
                  onClick={() =>
                    openExplorer(
                      getExplorerLink(
                        this.props.net,
                        this.props.explorer,
                        t.txid
                      )
                    )
                  }
                >
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-link" />
                  </div>
                  View Address on NeoTracker
                </div>
              </div>
              <div className="col-xs-2 center">
                <Link to="/">
                  <div className="dash-icon-bar">
                    <div className="icon-border">
                      <span className="glyphicon glyphicon-remove" />
                    </div>
                    Log Out of Address
                  </div>
                </Link>
              </div>
              <div className="col-xs-2 center">
                <div
                  className="warning dash-icon-bar"
                  onClick={() => deleteWallet(this.props.dispatch, key)}
                >
                  <div className="warning icon-border">
                    <span className="warning glyphicon glyphicon-trash" />
                  </div>
                  Remove Address
                </div>
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
