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
import { Accordion, AccordionItem } from "react-sanfona";

import Logo from "./Brand/LogoBlank";
import NeoLogo from "./Brand/Neo";
import Claim from "./Claim";
import TopBar from "./TopBar";
import gitsmLogo from "../img/gitsm.png";
import swhtLogo from "../img/swh.png";
import swhtScreen from "../img/swth-screen.png";

let explorer_select;

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

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
    <div className="col-xs-12">
    <div className="col-xs-12">
      <img
        src={swhtLogo}
        alt=""
        width="66"
        className="neo-logo fadeInDown"
      />
      <h1>Switcheo.Exchange</h1>
    </div>
    <div className="col-xs-5">
    <h4 className="top-20">Switcheo is the worlds first multi-chain decentralised exchange for NEO & NEP-5 tokens trading on the NEO blockchain.</h4>
    <p className="com-soon top-20">
    1) Maximize the Morpheus window width<br />
    2) Copy your NEO Encrypted Key<br />
    3) Click the Switcheo.Exchange to load exchange<br />
    4) Once loaded, click "Wallet Login"<br />
    5) Select "Encrypted Key"<br />
    6) Paste encrypted key and enter password.
    </p>
    </div>
    <div className="col-xs-7 top-20 center">
    <Link to="/switcheoExchange">
    <img
      src={swhtScreen}
      data-tip
      data-for="assetTip"
      alt=""
      width="450"
      className="neo-logo fadeInDown pointer"
    /></Link>

    <ReactTooltip
      className="solidTip"
      id="assetTip"
      place="top"
      type="dark"
      effect="solid"
    >
      <span>Click image to open Switcheo.Exchange</span>
    </ReactTooltip>

    </div>
    </div>
    <div className="clearboth" />

    <div className="col-xs-12">
          <div className="">
            <div className="clearboth" />
            <div className="">
            <div className="col-xs-12">
            <Accordion>
            <AccordionItem titleClassName="accord-title" title="Click here to view your NEO encrypted keys saved in Morpheus">
              <div className="switch-list">
              {_.map(this.props.wallets, (value, key) => {
                return (
                  <div className="">
                    <div className="walletItem">
                      <div className="walletName">{key.slice(0, 20)}</div>
                      <div className="walletKey-wide">
                      <input
        								className="ledger-address"
        								placeholder={value}
        								value={value}
        							/>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </AccordionItem>
            </Accordion>

            </div>

            </div>
          </div>
        </div>
      <div className="clearboth" />
      <div className="tokenfooter font-16 pointer">
      <div className="pointer"
      onClick={() =>
      openExplorer("https://switcheo.network")
      }
      >Official website: Switcheo.network</div><br />
   	 <strong>Legal Disclaimer:</strong> Switcheo.Exchange is not operated by or assosiated with Morpheus S.S. Limited. Morpheus is not liable for the loss of any tokens when using the Switcheo Exchange. Please visit the Switcheo.Network website or social channels for exchange support.</div>
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
