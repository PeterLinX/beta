import React, { Component } from "react";
import { Link } from "react-router";
import QRCode from "qrcode";
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

let key_name;
let wif;

const saveKey = async (dispatch, encWifValue, history) => {
  console.log("starting here")
  await storage.get("keys", async (error, data) => {
    data[key_name.value] = encWifValue;
    dispatch(sendEvent(true, "Saved key as " + key_name.value));
    await storage.set('keys', data, function(error) {
      if (error) console.log(error);
    }); 
    await setTimeout(() => dispatch(clearTransactionEvent()), 3000);
    setTimeout(() => history.push("/"), 3000);
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
  componentDidMount = () => {
    console.log(this.props.history);
    QRCode.toCanvas(
      this.publicCanvas,
      this.props.address,
      { version: 5 },
      err => {
        if (err) console.log(err);
      }
    );
    QRCode.toCanvas(
      this.privateCanvas,
      this.props.passphraseKey,
      { version: 5 },
      err => {
        if (err) console.log(err);
      }
    );
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render = () => (
    <div>
      <div className="displayWalletKeys">
        <div className="row send-neo-wide">
          <div className="row ">
            <div className="col-xs-12">
              <div className="row top-20">
                <div className="col-xs-3">
                  <p style={{ textAlign: "center" }}>Public QR Address</p>

                  <canvas
                    id="publicCanvas"
                    style={{
                      border: "10px solid #D3D3D3",
                      borderRadius: 30
                    }}
                    ref={node => (this.publicCanvas = node)}
                  />
                </div>

                <div className="col-xs-6 top-20">
                  <div className="keyList">
                    {/* public address */}
                    <div className="keyListItem">
                      <span className="wallet-logo">
                        <NeoLogo width="24" />
                      </span>{" "}
                      <h3>New NEO Address Created</h3>
                      <input
                        type="text"
                        onClick={() => clipboard.writeText(this.props.address)}
                        className="form-control pubicAddress font-plus"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.address}
                        placeholder={this.props.address}
                        data-tip
                        data-for="copyPublicKeyTip"
                      />
                    </div>
                    {/* public address */}
                    {/* secrect phrase */}
                    <div className="keyListItem">
                      <p className="key-label">Your Password:</p>
                      <input
                        type="text"
                        className="form-control"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.passphrase}
                        placeholder={this.props.passphrase}
                        data-tip
                        data-for="copyPassphraseTip"
                        onClick={() =>
                          clipboard.writeText(this.props.passphrase)
                        }
                      />
                    </div>
                    {/* secrect phrase */}
                  </div>

                  <ReactTooltip
                    className="solidTip"
                    id="copyPublicKeyTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy your NEO public address</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPrivateKeyTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy your NEO private key</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPassphraseTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy and save your password</span>
                  </ReactTooltip>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPassphraseKeyTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy and save your password encrypted key</span>
                  </ReactTooltip>
                </div>

                <div className="col-xs-3">
                  <div className="addressBox">
                    <p style={{ textAlign: "center" }}>Private Key</p>

                    <canvas
                      id="privateCanvas"
                      height={160}
                      width={160}
                      style={{
                        border: "10px solid #D3D3D3",
                        borderRadius: 30,
                        height: "160px !important",
                        width: "160px !important"
                      }}
                      ref={node => (this.privateCanvas = node)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="private">
              <div className="keyList">
                {/* Your Encrypted Private Key*/}
                <div className="col-xs-8 top-20">
                  <p className="key-label">
                    Please make a backup of your NEO Private Key:
                  </p>
                  <input
                    type="text"
                    onClick={() => clipboard.writeText(this.props.wif)}
                    className="form-control"
                    contentEditable={false}
                    readOnly={true}
                    value={this.props.wif}
                    placeholder={this.props.wif}
                    data-tip
                    data-for="copyPrivateKeyTip"
                  />
                </div>

                <div className="col-xs-4 top-20">
                  <p className="key-label">Name Your Address:</p>
                  <input
                    type="text"
                    className="form-control saveKey font-plus"
                    ref={node => (key_name = node)}
                    placeholder="Name your saved address"
                    data-tip
                  />
                </div>

                {/* Your Encrypted Private Key*/}
                <div className="col-xs-8">
                  <p className="key-label">
                    Please make a backup of your Encrypted Private Key and
                    Password:
                  </p>
                  <input
                    type="text"
                    onClick={() =>
                      clipboard.writeText(this.props.passphraseKey)
                    }
                    className="form-control"
                    contentEditable={false}
                    readOnly={true}
                    value={this.props.passphraseKey}
                    placeholder={this.props.passphraseKey}
                    data-tip
                    data-for="copyPassphraseKeyTip"
                  />
                </div>

                <div className="col-xs-4 top-30">
                  <button
                  data-tip
                  data-for="printTip"
                    onClick={() =>
                      saveKey(
                        this.props.dispatch,
                        this.props.passphraseKey,
                        this.props.history
                      )
                    }
                    className="login-button"
                  >
                  Saved Address & Login
                  </button>

                  {this.props.decrypting === true ? (
                    <div className="decrypting">Decrypting keys...</div>
                  ) : (
                    <div />
                  )}
                </div>
                <div className="col-xs-8 top-10">
                  <label className="checkbox-inline" style={{ color: "white" }}>
                    I have backed up my private data
                  </label>
                  <input
                    id="checkbox"
                    name="isChecked"
                    type="checkbox"
                    className="pull-left"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearboth" />
      </div>


    </div>
  );
}
const mapStateToProps = state => ({});

DisplayWalletKeys = connect(mapStateToProps)(DisplayWalletKeys);

export default DisplayWalletKeys;
