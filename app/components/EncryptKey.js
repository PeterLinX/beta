import React, { Component } from "react";
import { connect } from "react-redux";
import { newWallet, generating } from "../modules/generateWallet";
import { Link } from "react-router";
import WalletInfo from "./WalletInfo.js";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import DisplayWalletKeys from "./DisplayWalletKeys";
import { encryptWifAccount } from "neon-js";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import Logo from "./Brand/LogoBlank";

const logo = require("../images/neon-logo2.png");

let wif_input, passphrase, passphrase2;

// TODO: move to neon-js
// what is the correct length to check for?
const validatePassphrase = passphrase => {
  return passphrase.length >= 4;
};

const generateNewWallet = dispatch => {
  const current_phrase = passphrase.value;
  const current_wif = wif_input.value;
  if (passphrase.value !== passphrase2.value) {
    dispatch(sendEvent(false, "Passphrases do not match"));
    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
    return;
  }
  if (validatePassphrase(current_phrase)) {
    // TODO: for some reason this blocks, so giving time to processes the earlier
    // dispatch to display "generating" text, should fix this in future
    dispatch(sendEvent(true, "Generating encoded key..."));
    setTimeout(() => {
      encryptWifAccount(current_wif, current_phrase)
        .then(result => {
          dispatch(newWallet(result));
          dispatch(clearTransactionEvent());
        })
        .catch(() => {
          dispatch(sendEvent(false, "The private key is not valid"));
          setTimeout(() => dispatch(clearTransactionEvent()), 5000);
        });
    }, 500);
  } else {
    dispatch(sendEvent(false, "Please choose a longer password"));
    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
    passphrase.value = "";
    passphrase2.value = "";
  }
};

class CreateWallet extends Component {
  render = () => {
    const passphraseDiv = (
      <div>
      <div className="login-address-bk top-50">
      <div className="logo-top">
      <div className="row">
        <div className="center logobounce">
          <Link to={"/dashboard"}><Logo width={140} /></Link>
        </div>
        <br />
        <h1 className="center">Encrypt your private key</h1>
      </div>
      <div className="row">
      <div className="col-xs-10 col-xs-offset-1">
      <input
        type="text"
        className="form-send-neo"
        ref={node => (passphrase = node)}
        placeholder="Enter a password here"
      />
      </div>
      </div>

      <div className="row top-20">
      <div className="col-xs-10 col-xs-offset-1">
      <input
        type="text"
        className="form-send-neo"
        ref={node => (passphrase2 = node)}
        placeholder="Confirm your password"
      />
      </div>
      </div>

      <div className="row top-20">
      <div className="col-xs-10 col-xs-offset-1">
      <input
        type="text"
        className="form-send-neo"
        ref={node => (wif_input = node)}
        placeholder="Please enter a NEO Private Key here"
      />
      </div>
      </div>

      <div className="row top-20">
      <div className="col-xs-10 col-xs-offset-1 center">
      <button
      className="btn-send"
      onClick={() => generateNewWallet(this.props.dispatch)}>
        {" "}
        Generate encrypted key{" "}
      </button>

      </div>
      </div>






      </div>
      </div>
      </div>
    );
    return (
      <div id="newWallet">
        {this.props.wif === null ? passphraseDiv : <div />}
        {this.props.generating === true ? (
          <div className="generating">Generating keys...</div>
        ) : (
          <div />
        )}
        {this.props.generating === false && this.props.wif !== null ? (
          <DisplayWalletKeys
            address={this.props.address}
            wif={this.props.wif}
            passphrase={this.props.passphrase}
            passphraseKey={this.props.encryptedWif}
          />
        ) : (
          <div />
        )}
      </div>
    );
  };
}

const mapStateToProps = state => ({
  wif: state.generateWallet.wif,
  address: state.generateWallet.address,
  encryptedWif: state.generateWallet.encryptedWif,
  passphrase: state.generateWallet.passphrase,
  generating: state.generateWallet.generating
});

CreateWallet = connect(mapStateToProps)(CreateWallet);

export default CreateWallet;
