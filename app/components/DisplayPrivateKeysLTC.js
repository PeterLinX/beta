import React, { Component } from "react";
import { Link } from "react-router";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import storage from "electron-json-storage";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import litecoinLogo from "../img/litecoin.png";

let key_name;

const saveKey = async (dispatch, privKey, history) => {
  console.log("starting to save LTC private key");
  await storage.get("ltckeys", async (error, data) => {
    data[key_name.value] = privKey;
    dispatch(sendEvent(true, "Saved LTC private key as " + key_name.value));
    await storage.set("ltckeys", data, function(error) {
      if (error) console.log(error);
    });
    await setTimeout(() => dispatch(clearTransactionEvent()), 3000);
    setTimeout(() => history.push("/"), 3000);
  });
};

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
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
      }

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

class DisplayPrivateKeysLTC extends Component {
  componentDidMount = () => {
    console.log("DisplayPrivateKeysLTC mounted");
    console.log(JSON.stringify(this.props));
    QRCode.toCanvas(
      this.publicCanvas,
      this.props.routeParams.ltc_address,
      { version: 5 },
      err => {
        if (err) console.log(err);
      }
    );

    QRCode.toCanvas(
      this.privateCanvas,
      this.props.routeParams.ltcPrivKey,
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
      <div id="send">
        <div className="dash-panel">
          <div className="row">
            <div className="col-xs-12">
              <img
                src={litecoinLogo}
                alt=""
                width="44"
                className="neo-logo logobounce"
              />
              <h2>New LTC Address Created</h2>
            </div>
            <div className="col-xs-12 center">
              <hr className="dash-hr-wide" />
            </div>
            <div className="col-xs-12">
              <div className="row top-10">
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
                  <div className="ketList">
                    {}
                    <div className="keyListItem">
                      <p className="key-label">Your LTC Public Address</p>
                      <input
                        type="text"
                        onClick={() =>
                          clipboard.writeText(
                            this.props.routeParams.ltc_address
                          )
                        }
                        className="form-control pubicAddress"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.routeParams.ltc_address}
                        placeholder={this.props.routeParams.ltc_address}
                        data-tip
                        data-for="copyPublicAddressTip"
                      />
                    </div>

                    <div className="keyListItem">
                      <p className="key-label">Your LTC Private Key</p>
                      <textarea
                        type="text"
                        className="form-control"
                        contentEditable={false}
                        readOnly={true}
                        value={this.props.routeParams.ltcPrivKey}
                        data-tip
                        data-for="copyPrivateKeyTip"
                        onClick={() =>
                          clipboard.writeText(this.props.routeParams.ltcPrivKey)
                        }
                      />
                    </div>
                  </div>
                  <ReactTooltip
                    className="solidTip"
                    id="copyPublicAddressTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy your LTC public address</span>
                  </ReactTooltip>

                  <ReactTooltip
                    className="solidTip"
                    id="copyPrivateKeyTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Copy your LTC private key</span>
                  </ReactTooltip>
                </div>

                <div className="col-xs-3 margin-20-left">
                  <div className="addressBox">
                    <p style={{ textAlign: "center" }}>Private Key</p>

                    <canvas
                      id="privateCanvas"
                      height={120}
                      width={120}
                      style={{
                        border: "10px solid #D3D3D3",
                        borderRadius: 30,
                        height: "120px !important",
                        width: "120px !important"
                      }}
                      ref={node => (this.privateCanvas = node)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="private">
              <div className="keyList">
                <div className="col-xs-8">
                  <p className="key-label">Please name your private key:</p>
                  <input
                    type="text"
                    className="form-control saveKey font-plus"
                    ref={node => (key_name = node)}
                    placeholder="Name your saved address"
                    data-tip
                  />
                </div>

                <div className="col-xs-4 top-30">
                  <Link to="/NewLitecoin">
                    <button
                      data-tip
                      className="grey-button"
                      data-for="printTip"
                      onClick={() =>
                        saveKey(
                          this.props.dispatch,
                          this.props.routeParams.ltcPrivKey,
                          this.props.routeParams.history
                        )
                      }
                    >
                      <span className="glyphicon glyphicon-user marg-right-5" />
                      Save LTC Address
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="clearboth" />
      <div className="dash-bar top-10">
        <div
          className="dash-icon-bar"
          onClick={() => clipboard.writeText(this.props.ltcPubAddr)}
        >
          <div className="icon-border">
            <span className="glyphicon glyphicon-duplicate" />
          </div>
          Copy Public Address
        </div>

        <div className="dash-icon-bar" onClick={() => print()}>
          <div className="icon-border">
            <span className="glyphicon glyphicon-print" />
          </div>
          Print Public Address
        </div>

        <div
          className="dash-icon-bar"
          onClick={() =>
            openExplorer(getLink(this.props.net, this.props.ltcPubAddr))
          }
        >
          <div className="icon-border">
            <span className="glyphicon glyphicon-link" />
          </div>
          View On Blockchain
        </div>

        <Link to="/NewLitecoin">
          <div className="dash-icon-bar">
            <div className="icon-border">
              <span className="glyphicon glyphicon-triangle-left" />
            </div>
            Return to Litecoin Login
          </div>
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({});
DisplayPrivateKeysLTC = connect(mapStateToProps)(DisplayPrivateKeysLTC);
export default DisplayPrivateKeysLTC;
