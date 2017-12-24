import React, { Component } from "react";
import { connect } from "react-redux";
import { newWallet, generating } from "../modules/generateWallet";
import { Link } from "react-router";
import WalletInfo from "./WalletInfo.js";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import DisplayWalletKeys from "./DisplayPrivateKeys";
import { generateEncryptedWif } from "neon-js";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import Logo from "./Brand/LogoBlank";
import NeoLogo from "./Brand/Neo";
import IconBar from "./IconBar";

const logo = require("../img/app-logo.png");
const { dialog } = require("electron").remote;

let passphrase, passphrase2;

// TODO: move to neon-js
// what is the correct length to check for?
const validatePassphrase = passphrase => {
  return passphrase.length >= 8;
};

const generateNewWallet = dispatch => {
  const current_phrase = passphrase.value;
  if (passphrase.value !== passphrase2.value) {
    dispatch(sendEvent(false, "Passwords do not match. Try Again."));
    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
    return;
  }
  if (validatePassphrase(current_phrase)) {
    // TODO: for some reason this blocks, so giving time to processes the earlier
    // dispatch to display "generating" text, should fix this in future
    dispatch(sendEvent(true, "Generating wallet keys..."));
    setTimeout(() => {
      generateEncryptedWif(current_phrase).then(result => {
        dispatch(newWallet(result));
        dispatch(clearTransactionEvent());
      });
    }, 500);
  } else {
    dispatch(
      sendEvent(
        false,
        "Please choose a longer password. A minimum of 8 characters is recommended that contains uppercase letters, lowercase letters, numbers and symbols (!@#$%^&*)."
      )
    );
    setTimeout(() => dispatch(clearTransactionEvent()), 3000);
    passphrase.value = "";
    passphrase2.value = "";
  }
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
      // dispatch(setKeys(keys));
      // storage.set('keys', keys);
    });
  });
};

class CreateWallet extends Component {
  componentDidMount() {
    document.addEventListener("keydown", event => {
      const keyName = event.key;

      if (keyName === "Enter") {
        generateNewWallet(this.props.dispatch);
      }
    });
  }

  render = () => {
    const passphraseDiv = (
      <div>
        <div className="login-address-bk top-50">
          <div className="row logo-top">
            <div className="center logobounce">
              <Logo width={140} />
            </div>

            <div className="col-xs-10 col-xs-offset-1">
              <div className="">
                <br />
                <h1 style={{ color: "white", textAlign: "center" }}>
                  Create a NEO Address
                </h1>
              </div>

              <div className="row">
                <div className="col-xs-offset-1 col-xs-10">
                  <div className="form-group">
                    <input
                      type="text"
                      className="trans-form loginfade"
                      ref={node => (passphrase = node)}
                      placeholder="Enter a secure password"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="trans-form loginfade"
                      ref={node => (passphrase2 = node)}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <div className="col-xs-10 col-xs-offset-1 ">
                  <div
                    className="login-button"
                    onClick={() => generateNewWallet(this.props.dispatch)}
                  >
                    Create Address
                  </div>
                </div>

                <div className="col-xs-10 col-xs-offset-1 center top-10 grey-out">
                  <p>
                    Please use a strong password. A minimum of 8 characters that contains uppercase and lowercase letters, numbers and symbols (!@#$%^&*).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="dash-bar">
            <Link to="/">
              <div className="dash-icon-bar">
                <div className="icon-border">
                  <span className="glyphicon glyphicon-user" />
                </div>
                Open a Saved Wallet
              </div>
            </Link>

            <Link to="/LoginPrivateKey">
              <div className="dash-icon-bar">
                <div className="icon-border">
                  <span className="glyphicon glyphicon-qrcode" />
                </div>
                Login Via Private Key
              </div>
            </Link>

            <Link to="/LoginNep2">
              <div className="dash-icon-bar">
                <div className="icon-border">
                  <span className="glyphicon glyphicon-lock" />
                </div>
                Login Via Encrypted Key
              </div>
            </Link>
            <div
              className="dash-icon-bar"
              onClick={() => loadKeyRecovery(this.props.dispatch)}
            >
              <div className="icon-border">
                <span className="glyphicon glyphicon-paperclip" />
              </div>
              Login Via Recovery File
            </div>
          </div>
        </div>
      </div>
    );
    return (
      <div id="newWallet">
        {this.props.wif === null ? passphraseDiv : <div />}
        {this.props.generating === true ? (
          <div className="generating">Generating keys</div>
        ) : (
          <div />
        )}
        {this.props.generating === false && this.props.wif !== null ? (
          <DisplayWalletKeys
            history={this.props.history}
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
