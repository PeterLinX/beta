import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { login } from "../modules/account";
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { getAccountsFromWIFKey } from "neon-js";
import Logo from "./Brand/LogoBlank";
import neoIcon from "../img/neo-icon.png";
import goIcon from "../img/go-icon.png";

let wif;

const logo = require("../img/app-logo.png");

// TODO: move to neon-js
const verifyPrivateKey = wif => {
  try {
    // TODO: better check
    getAccountsFromWIFKey(wif)[0].address;
  } catch (e) {
    return false;
  }
  return true;
};

const onWifChange = (dispatch, history, wif) => {
  const value = wif.value;
  // TODO: changed back to only WIF login for now, getting weird errors with private key hex login
  if (verifyPrivateKey(value) === true) {
    dispatch(login(value));
    history.push("/dashboard");
  } else {
    dispatch(sendEvent(false, "That is not a valid private key"));
    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
  }
};

const { dialog } = require("electron").remote;
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

let LoginPrivateKey = ({ dispatch, loggedIn, wif, history }) => (
  <div>
    <div className="login-address-bk top-50">
      <div className="logo-top">
        <div className="row">
          <div className="center logobounce">
            <Logo width={140} />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div>
              <br />
              <h1 className="center">Welcome to Morpheus</h1>
            </div>

            <div className="row top-50">
              <div className="col-xs-10 col-xs-offset-1">
                <div className="form-group">
                  <input
                    type="password"
                    className="trans-form"
                    placeholder="Enter a NEO private key"
                    ref={node => (wif = node)}
                  />
                </div>
                <hr className="purple" />
              </div>

              <div
                className="go-icon fadeInLeft"
                onClick={e => onWifChange(dispatch, history, wif)}
              />
            </div>
            <br />

            <p className="center top-20 col-xs-10 col-xs-offset-1">
              Your private key is never shared and is only used to load your
              balance and transaction history from the blockchain. Once entered,
              you can create an encrypted saved walet in Morpheus. You may still
              use your private key with other wallets.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="dash-bar top-50">
      <Link to="/create">
        <div className="dash-icon-bar">
          <div className="icon-border">
            <div className="neo-icon"></div>
          </div>
          Create a Neo Address
        </div>
      </Link>

      <Link to="/LoginNep2">
      <div className="dash-icon-bar">
        <div className="icon-border">
          <span className="glyphicon glyphicon-lock"></span>
        </div>
        Login Via Encrypted Key
      </div>
      </Link>

      <Link to="/LoginLocalStorage">
        <div className="dash-icon-bar">
          <div className="icon-border">
            <span className="glyphicon glyphicon-user" />
          </div>
          Open a Saved Wallet
        </div>
      </Link>

      <div className="dash-icon-bar" onClick={() => loadKeyRecovery(dispatch)}>
        <div className="icon-border">
          <span className="glyphicon glyphicon-paperclip" />
        </div>
        Login Via Recovery File
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  loggedIn: state.account.loggedIn,
  wif: state.account.wif
});

LoginPrivateKey = connect(mapStateToProps)(LoginPrivateKey);

export default LoginPrivateKey;
