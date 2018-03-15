import React, { Component } from "react";
import { Link } from "react-router";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import storage from "electron-json-storage";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import ethLogo from "../img/eth.png";

const getLink = (net, address) => {
    let base = "https://etherscan.io/address/";
    return base + address;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

let key_name;

const saveKey = async (dispatch, privKey, history, selfHistory) => {
    console.log("starting to save ETH private key");
    if (key_name === undefined || key_name.value === '') {
        dispatch(sendEvent(false, "Please input name!"));
    } else {
        await storage.get("ethkeys" , async (error, data) => {
            data[key_name.value] = privKey;
            dispatch(sendEvent(true, "Saved ETH private key as " + key_name.value));
            await storage.set("ethkeys", data, function (error) {
                if (error) console.log(error);
            });
            await setTimeout(() => dispatch(clearTransactionEvent()),3000);
            setTimeout(() => selfHistory.push("/newEthereum"),3000);
        });
    }
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

            fs.writeFile(fileName, content, err =>{
                if (err) {
                    alert("An error ocurred creating the file " + err.message);
                }
                alert("The file has been succesfully saved")
            });
        }
    );
};

const resetGeneratedKey = dispatch => {
    dispatch(resetKey());
};

class DisplayPrivateKeysETH extends Component {
    componentDidMount = () => {
        console.log(this.props.routeParams.history);
        QRCode.toCanvas(
            this.publicCanvas,
            this.props.routeParams.eth_address,
            { version: 5},
            err => {
                if (err) console.log(err);
            }
        );

        QRCode.toCanvas(
            this.privateCanvas,
            this.props.routeParams.ethPrivKey,
            {version: 5},
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
                            src={ethLogo}
                            alt=""
                            width="28"
                            className="neo-logo logobounce"
                        />
                        <h2>New ETH Address Created</h2>
                        </div>
                        <div className="col-xs-12 center">
          								<hr className="dash-hr-wide" />
          							</div>
                        <div className="col-xs-12">

                            <div className="row top-10">

                            <div className="col-xs-3 top-10">
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



                                <div className="col-xs-9 top-10">
                                        {}
                                        <div className="col-xs-12 top-20">
                                            <p className="key-label">Your ETH Private Key</p>
                                            <textarea
                                                type="text"
                                                className="form-control font-plus"
                                                contentEditable={false}
                                                readOnly={true}
                                                value={this.props.routeParams.ethPrivKey}
                                                placeholder={this.props.routeParams.ethPrivKey}
                                                data-tip
                                                data-for="copyPrivateKeyTip"
                                                onClick={() => clipboard.writeText(this.props.routeParams.ethPrivKey)}
                                            />
                                    </div>

                                    <div className="col-xs-6">
                                        <p className="key-label">
                                            Name your ETH private key:
                                        </p>
                                        <input
                                        type="text"
                                            className="form-control saveKey font-plus"
                                            ref={node => (key_name = node)}
                                            placeholder="Name your saved address"
                                            data-tip
                                        />
                                    </div>

                                    <div className="col-xs-6">

                                   <button
                                  data-tip
                                  data-for="savePrivateKeyTip"
                                   className="print-btn-red top-30"
                                   onClick={() => print()}
                                   >
                                   <span className="glyphicon glyphicon-print marg-right-5" />
                                   Print Private Data
                                   </button>

                                   </div>


                                    <ReactTooltip
                                        className="solidTip"
                                        id="copyPublicAddressTip"
                                        place="top"
                                        type="light"
                                        effect="solid"
                                    >
                                        <span>Copy your ETH public address</span>
                                    </ReactTooltip>

                                    <ReactTooltip
                                        className="solidTip"
                                        id="copyPrivateKeyTip"
                                        place="top"
                                        type="light"
                                        effect="solid"
                                    >
                                        <span>This is your ETH private key.<br />It can be used to restore your ETH account<br />You must backup this data.</span>
                                    </ReactTooltip>

                                   <ReactTooltip
                                        className="solidTip"
                                        id="savePrivateKeyTip"
                                        place="top"
                                        type="light"
                                        effect="solid"
                                    >
                                        <span>Print ETH Private Key!</span>
                                    </ReactTooltip>

                            </div>

                            <div className="col-xs-12">
                            <div className="col-xs-8 top-20">
                               <p>
                                        Your Ethereum privte key gives you full control of your Ethereum address. Morpheus can not assist you recover a lost private key or funds. Back up your private key before proceeding. Click save to access your Ethereum Public Address.
                               </p>
                               </div>

                               <div className="col-xs-4">
                               <button
                                   data-tip
                                   className="grey-button top-30"
                                   data-for="printTip"
                                   onClick={ ()=>
                                       saveKey(
                                           this.props.dispatch,
                                           this.props.routeParams.ethPrivKey,
                                           this.props.routeParams.history,
                                           this.props.history
                                       )
                                   }
                               >
                               <span className="glyphicon glyphicon-save  marg-right-5" />
                               Save and Login
                               </button>
                               </div>

                         </div>
                         </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="clearboth" />
        </div>
    );
}

const mapStateToProps = state => ({});
DisplayPrivateKeysETH = connect (mapStateToProps) (DisplayPrivateKeysETH);
export default DisplayPrivateKeysETH;
