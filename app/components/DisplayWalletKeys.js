import React, { Component } from "react";
import { Link } from "react-router";
// import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import storage from "electron-json-storage";
import { resetKey } from "../modules/generateWallet";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { login } from "../modules/account";
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import Logo from "./Brand/LogoBlank";
import NeoLogo from "./Brand/Neo";
import PrivateView from "./DisplayPrivateKeys";
var QRCode = require("qrcode.react");

let key_name;
let wif;

const saveKey = async (dispatch, encWifValue, history) => {
  await storage.get("keys", async (error, data) => {
    data[key_name.value] = encWifValue;
    dispatch(sendEvent(true, "Saved key as " + key_name.value));
    await storage.set("keys", data);
    await setTimeout(() => dispatch(clearTransactionEvent()), 5000);
    setTimeout(() => history.push("/loginLocalStorage"), 5000);
  });
};

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

const resetGeneratedKey = dispatch => {
  dispatch(resetKey());
};

class DisplayWalletKeys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isChecked: true
    };
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  render = () => {
    if (this.state.show === true) {
      return (
        <PrivateView
          history={this.props.history}
          address={this.props.address}
          wif={this.props.wif}
          passphrase={this.props.passphrase}
          passphraseKey={this.props.passphraseKey}
        />
      );
    }
    return (
      <div>
        <div className="new-address-bk">
          <div id="displayWalletKeys">
            <div className="center neoLogo">
              <NeoLogo width={115} />
            </div>
            <div className="col-xs-12">
              <p className="welcome">
                Congratulations! New NEO Address Created
              </p>
              {/* qr */}
              <div className="row">
                <div className="col-xs-4">
                  <div className="addressBox">
                    <QRCode value={this.props.address} />
                  </div>
                </div>
                <div className="col-xs-8">
                  <div className="keyList">
                    <div className="form-group">
                      <p className="key-label">Your Public NEO Address</p>
                      <input
                        type="text"
                        onClick={() => clipboard.writeText(this.props.address)}
                        className="form-control pubicAddress"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.address}
                        data-tip
                        data-for="copyPublicKeyTip"
                      />
                    </div>

                    <div className="form-group">
                      <p className="key-label">Your Secure Password</p>
                      <input
                        type="text"
                        onClick={() =>
                          clipboard.writeText(this.props.passphrase)}
                        className="form-control"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.passphrase}
                        data-tip
                        data-for="copyPassphraseTip"
                        onClick={() =>
                          clipboard.writeText(this.props.passphrase)}
                      />
                    </div>
                  </div>
                  <div className="saveKey">
                    {/* <input
                      type="text"
                      placeholder="Name this key"
                      ref={node => (key_name = node)}
                    />
                    <button
                      onClick={() =>
                        saveKey(this.props.dispatch, this.props.passphraseKey)}
                    >
                      Save Key
                    </button> */}
                  </div>
                  {/* <Link
                      onClick={() => resetGeneratedKey(this.props.dispatch)}
                      to="/create"
                    >
                      <button className="btn btn-form btn-mini">Back</button>
                    </Link> */}
                  <ReactTooltip
                    className="solidTip"
                    id="copyPublicKeyTip"
                    place="bottom"
                    type="dark"
                    effect="solid"
                  >
                    <span>Copy Public Key</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPrivateKeyTip"
                    place="bottom"
                    type="dark"
                    effect="solid"
                  >
                    <span>Copy Private Key</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPassphraseTip"
                    place="bottom"
                    type="dark"
                    effect="solid"
                  >
                    <span>Copy Password</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPassphraseKeyTip"
                    place="bottom"
                    type="dark"
                    effect="solid"
                  >
                    <span>Copy Password Encrypted Key</span>
                  </ReactTooltip>
                </div>
                <div className="col-xs-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control saveKey"
                      ref={node => (key_name = node)}
                      placeholder="Name your saved wallet"
                      data-tip
                    />
                  </div>
                </div>
                <div className="col-xs-4">
                  <div className="form-group">
                    <button
                      onClick={() =>
                        saveKey(
                          this.props.dispatch,
                          this.props.passphraseKey,
                          this.props.history
                        )}
                      className="btn-send"
                    >
                      Save & Continue
                    </button>

                    {this.props.decrypting === true ? (
                      <div className="decrypting">Decrypting keys...</div>
                    ) : (
                      <div />
                    )}

                    {this.props.decrypting === true ? (
                      <div className="decrypting">Decrypting keys...</div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
              <div className="clearboth" />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <label
                className="checkbox-inline"
                style={{ color: "white" }}
              >
                I have backed up my password and understand it will not
                be shown to me again.
              </label>
              <input
                id="checkbox"
                name="isChecked"
                type="checkbox"
                className="pull-left"
                value={this.state.isChecked}
                onChange={this.handleInputChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="dash-bar">
          <div className="dash-icon-bar" onClick={() => print()}>
            <div className="icon-border">
              <span className="glyphicon glyphicon-print" />
            </div>
            Print Wallet Data
          </div>
          <div className="dash-icon-bar" onClick={() => {
              this.setState({ show: true });
            }} >
              <div className="icon-border">
                <span className="glyphicon glyphicon-qrcode"></span>
              </div>
              View Private Data
            </div>
          <div
            className="dash-icon-bar"
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            <div className="icon-border">
              <span className="glyphicon glyphicon-download-alt" />
            </div>
            Download Recovery File
          </div>
          <Link to="/">
            <div className="dash-icon-bar">
              <div className="icon-border">
                <span className="glyphicon glyphicon-chevron-left" />
              </div>
              Back to Login Options
            </div>
          </Link>
        </div>
      </div>
    );
  };
}
const mapStateToProps = state => ({});

DisplayWalletKeys = connect(mapStateToProps)(DisplayWalletKeys);

export default DisplayWalletKeys;
