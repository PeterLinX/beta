import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { setBlockExplorer } from "../modules/metadata";
import { setKeys } from "../modules/account";
import Delete from "react-icons/lib/md/delete";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import rpxLogo from "../img/rpx.png";
import nexLogo from "../img/nex.png";
import qlinkLogo from "../img/qlink.png";
import thekeyLogo from "../img/thekey.png";
import peeratlasLogo from "../img/peeratlas.png";
import ontologyLogo from "../img/ontology.png";
import btcLogo from "../img/btc-logo.png";
import neoLogo from "../img/neo.png";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";
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

class Tokens extends Component {
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
        <div className="tokens-window">

        <div className="col-xs-3  top-20">
        <img
          src={neoLogo}
          alt=""
          width="96"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>NEO & GAS (NEO/GAS)</h3>
        NEO has two native tokens, NEO and NeoGas (abbreviated symbol GAS). The minimum unit of NEO is 1 and tokens cannot be subdivided. The minimum unit of GAS is 0.00000001. All NEO/GAS transactions are free.
        <ul className="social-bar">
        <li><span className="glyphicon glyphicon-globe"/> Website</li>
        <li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20">
        <div className="icon-border"><span className="glyphicon glyphicon-ok" /></div>
        Sccessfully Added
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3  top-20">
        <img
          src={btcLogo}
          alt=""
          width="96"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Bitcoin (BTC)</h3>
        Bitcoin uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of bitcoins is carried out collectively by the network. All BTC transactionsa are subject to network fees.
        <ul className="social-bar">
        <li><span className="glyphicon glyphicon-globe"/> Website</li>
        <li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
        Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3  top-20">
        <img
          src={rpxLogo}
          alt=""
          width="120"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Red Pulse (RPX)</h3>
        The current Red Pulse platform was launched in 2015 and is already being utilised by leading financial institutions and Fortune 500 corporations.
        <ul className="social-bar">
        <li><span className="glyphicon glyphicon-globe"/> Website</li>
        <li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3 top-20">
        <img
          src={nexLogo}
          alt=""
          width="120"
          className="tokens top-10"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>NEX Exchange (NEX)</h3>
        NEX is a platform for complex decentralized cryptographic trade and payment service creation. NEX combines the NEO blockchain with an off-chain matching engine to enable much faster and more complex trades than existing decentralized exchanges.
        <ul className="social-bar">
        <li><span className="glyphicon glyphicon-globe"/> Website</li>
        <li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3 ">
        <img
          src={qlinkLogo}
          alt=""
          width="120"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>QLink (QLK)</h3>
        Qlink, a decentralized mobile network, is dedicated to constructing an open-source telecom infrastructure on blockchain.
<ul className="social-bar">
<li><span className="glyphicon glyphicon-globe"/> Website</li>
<li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={thekeyLogo}
          alt=""
          width="120"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>TheKEY (TKY)</h3>
THEKEY Project Team is now developing an identification verification (IDV) tool with blockchain based dynamic multi-dimension identification (BDMI) by using Personally Identifiable Information (PII) which is exclusively authorized by government authorities.
<ul className="social-bar">
<li><span className="glyphicon glyphicon-globe"/> Website</li>
<li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={peeratlasLogo}
          alt=""
          width="105"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>PeerAtlas (ATLAS)</h3>
The ATLAS token represents the permanent destruction of the world’s most unethical paywall: cutting-edge medical knowledge has been separated by money from its physicians and the general public.
<ul className="social-bar">
<li><span className="glyphicon glyphicon-globe"/> Website</li>
<li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={ontologyLogo}
          alt=""
          width="120"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Ontology (ONT)</h3>
        Ontology Network is a blockchain/distributed ledger network which combines distributed identity verification, data exchange, data collaboration, procedure protocols, communities, attestation, and various industry-specific modules. Together this builds the infrastructure for a peer-to-peer trust network which is cross-chain, cross-system, cross-industry, cross-application, and cross-device.
<ul className="social-bar">
<li><span className="glyphicon glyphicon-globe"/> Website</li>
<li><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<ReactTooltip
  className="solidTip"
  id="tokenTip"
  place="top"
  type="light"
  effect="solid"
>
  <span>Coming Soon</span>
</ReactTooltip>
        <div className="clearboth"/>
        <div className="row top-20" />
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

Tokens = connect(mapStateToProps)(Tokens);

export default Tokens;
