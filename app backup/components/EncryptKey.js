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
    setTimeout(() => dispatch(clearTransactionEvent()), 2000);
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
          setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        });
    }, 500);
  } else {
    dispatch(sendEvent(false, "Please choose a longer password"));
    setTimeout(() => dispatch(clearTransactionEvent()), 2000);
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
                  <Logo width={140} />
              </div>
              <h1 className="center">Encrypt your private key</h1>
            </div>
            <div className="row">
              <div className="col-xs-10 col-xs-offset-1">
                <input
                  type="text"
                  className="trans-form"
                  ref={node => (passphrase = node)}
                  placeholder="Enter a password here"
                />
              </div>
            </div>

            <div className="row top-20">
              <div className="col-xs-10 col-xs-offset-1">
                <input
                  type="text"
                  className="trans-form"
                  ref={node => (passphrase2 = node)}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="row top-20">
              <div className="col-xs-10 col-xs-offset-1">
                <input
                  type="text"
                  className="trans-form"
                  ref={node => (wif_input = node)}
                  placeholder="Please enter a NEO Private Key here"
                />
              </div>
            </div>

            <div className="row top-20">
              <div className="col-xs-10 col-xs-offset-1 center">
                <button
                  className="login-button"
                  onClick={() => generateNewWallet(this.props.dispatch)}
                >
                  {" "}
                  Generate encrypted key{" "}
                </button>
              </div>
            </div>
          </div>

          <div className="center top-10 col-xs-8 col-xs-offset-2 grey-out">
            Your private key is never shared online and is only used to unlock your address on your computer.
          </div>

          <div className="clearboth" />
        </div>




<div className="clearboth" />
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


<div className="clearboth" />

<div className="dash-bar top-20">
  <div className="dash-icon-bar" onClick={() => print()}>
    <div className="icon-border">
      <span className="glyphicon glyphicon-print" />
    </div>
    Print Wallet Data
  </div>

  <Link to="/LoginPrivateKey">
    <div className="dash-icon-bar"
    data-tip
    data-for="loginTip"
    >
      <div className="icon-border">
        <span className="glyphicon glyphicon-qrcode" />
      </div>
      Login Using Private Key
    </div>
  </Link>

  <Link to="/LoginNep2">
    <div className="dash-icon-bar"
    data-tip
    data-for="loginTip"
    >
      <div className="icon-border">
        <span className="glyphicon glyphicon-lock" />
      </div>
      Login Using Encrypted Key
    </div>
  </Link>

  <Link to="/">
  <div className="dash-icon-bar"
  data-tip
  data-for="loginTip"
  >
    <div className="icon-border">
      <span className="glyphicon glyphicon-user" />
    </div>
    Open Saved Wallet
  </div>


  <ReactTooltip
    className="solidTip"
    id="loginTip"
    place="top"
    type="light"
    effect="solid"
  >
    <span>Save address before loggin in</span>
  </ReactTooltip>

  <ReactTooltip
    className="solidTip"
    id="printTip"
    place="top"
    type="light"
    effect="solid"
  >
    <span>Print private data before proceeding</span>
  </ReactTooltip>


  </Link>
</div>

  			<div className="login-copyright">&copy; Copyright 2018 Morpheus</div>

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
