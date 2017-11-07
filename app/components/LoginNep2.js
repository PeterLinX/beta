import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, browserHistory } from "react-router";
import { login, decrypting } from "../modules/account";
import CreateWallet from "./CreateWallet.js";
import { decrypt_wif } from "neon-js";
import Logo from "./Brand/LogoBlank";
// TODO: these event messages should be refactored from transactions
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

const logo = require("../images/neon-logo2.png");

let wif_input;
let passphrase_input;

const onWifChange = (dispatch, history) => {
  if (passphrase_input.value.length < 4) {
    dispatch(sendEvent(false, "Passphrase too short"));
    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
    return;
  }
  // console.log(wif_input, passphrase_input);
  // TODO: changed back to only WIF login for now, getting weird errors with private key hex login
  dispatch(sendEvent(true, "Decrypting encoded key..."));
  setTimeout(() => {
    const encWifValue = wif_input.value;
    decrypt_wif(encWifValue, passphrase_input.value)
      .then(wif => {
        dispatch(login(wif));
        history.push("/dashboard");
        dispatch(clearTransactionEvent());
      })
      .catch(() => {
        dispatch(sendEvent(false, "Wrong passphrase or invalid encrypted key"));
        setTimeout(() => dispatch(clearTransactionEvent()), 5000);
      });
  }, 500);
};

class LoginNep2 extends Component {
  render = () => {
    const dispatch = this.props.dispatch;
    return (
      <div>
        <div className="login-address-bk top-50">
          <div className="logo-top">
            <div className="row">
              <div className="center logobounce">
                <Logo width={140} />
              </div>
              <br />
              <h1 className="center">Welcome to Morpheus</h1>
            </div>

            <div className="row">
              <div className="col-xs-10 col-xs-offset-1">
                <div className="form-group">
                <input
                  type="password"
                  className="trans-form"
                  placeholder="1. Enter your password"
                  ref={node => (passphrase_input = node)}
                />
                </div>
                <div className="col-xs-10 col-xs-offset-1">
                <hr className="purple" />
                </div>
              </div>
              <div className="col-xs-10 col-xs-offset-1">
              <div className="form-group">
              <input
                type="password"
                className="trans-form"
                placeholder="2. Enter your NEO encrypted key"
                ref={node => (wif_input = node)}
              />

              </div>
              </div>
              <p className="center top-50 col-xs-10 col-xs-offset-1">
                Your encrypted private key and password are never shared and are
                only used to load your balance and transaction history from the
                blockchain.
              </p>

              <div
                className="go-icon fadeInLeft pulse"
                onClick={e => onWifChange(dispatch, this.props.history)}
              />
            </div>
            {this.props.decrypting === true ? (
              <div className="decrypting">Decrypting keys...</div>
            ) : (
              <div />
            )}
          </div>
        </div>
        <div className="row">
          <div className="dash-bar">
            <Link to="/create">
              <div className="dash-icon-bar">
                <div className="icon-border">
                  <div className="neo-icon"></div>
                </div>
                Create a Neo Address
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
            <Link to="/">
              <div className="dash-icon-bar">
                <div className="icon-border">
                  <span className="glyphicon glyphicon-qrcode" />
                </div>
                Login Via Private Key
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
  };
}

const mapStateToProps = state => ({
  decrypting: state.account.decrypting
});

LoginNep2 = connect(mapStateToProps)(LoginNep2);

export default LoginNep2;
