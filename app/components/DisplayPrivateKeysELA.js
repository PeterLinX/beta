import React, { Component } from "react";
import { Link } from "react-router";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import storage from "electron-json-storage";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import elaLogo from "../img/ela.png";


let key_name;

const saveKey = async (dispatch, privKey, history,selfHistory) => {
    console.log("starting to save ELA private key");
    if (key_name === undefined || key_name.value === '') {
        dispatch(sendEvent(false, "Please input name!"));
    } else {
        await storage.get("elakeys" , async (error, data) => {
            data[key_name.value] = privKey;
            dispatch(sendEvent(true, "Saved ELA private key as " + key_name.value));
            await storage.set("elakeys", data, function (error) {
                if (error) console.log(error);
            });
            console.log("elastos login");
            await setTimeout(() => dispatch(clearTransactionEvent()),3000);
            setTimeout(() => selfHistory.push("/newElastos"),3000);
        });
    }
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

class DisplayPrivateKeysELA extends Component {
    componentDidMount = () => {
        console.log('DisplayPrivateKeysELA mounted');
        QRCode.toCanvas(
            this.publicCanvas,
            this.props.routeParams.ela_address,
            { version: 5},
            err => {
                if (err) console.log(err);
            }
        );

        QRCode.toCanvas(
            this.privateCanvas,
            this.props.routeParams.elaPrivKey,
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
                                src={elaLogo}
                                alt=""
                                width="64"
                                className="neo-logo logobounce"
                            />
                            <h2>Save Elastos Private Key</h2>
                        </div>
                        <div className="col-xs-12 center">
                            <hr className="dash-hr-wide" />
                        </div>
                        <div className="col-xs-12">

                            <div className="row top-10">

                                <div className="col-xs-3">
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


                                <div className="col-xs-9 top-20">
                                    {}
                                    <div className="col-xs-12">
                                        <p className="key-label">Your ELA Private Key</p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            contentEditable={false}
                                            readOnly={true}
                                            value={this.props.routeParams.elaPrivKey}
                                            data-tip
                                            data-for="copyPrivateKeyTip"
                                            onClick={() => clipboard.writeText(this.props.routeParams.elaPrivKey)}
                                        />
                                    </div>

                                    <div className="col-xs-6">
                                        <p className="key-label">
                                            Name your ELA private key:
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
                                        <span>Copy your ELA public address</span>
                                    </ReactTooltip>

                                    <ReactTooltip
                                        className="solidTip"
                                        id="copyPrivateKeyTip"
                                        place="top"
                                        type="light"
                                        effect="solid"
                                    >
                                        <span>Copy your ELA private key</span>
                                    </ReactTooltip>
                                </div>

                            </div>

                            <div className="private">
                                <div className="keyList">
                                    <div className="col-xs-8 top-20">
                                        <p>
                                            Your Elastos privqte key gives you full control of your Elastos address. Morpheus can not assist you recover a lost private key or funds. Back up your private key before proceeding. Click save to access your Elastos Public Address.
                                        </p>
                                    </div>


                                    <div className="col-xs-4 top-20">

                                        <button
                                            data-tip
                                            data-for="savePrivateKeyTip"
                                            className="grey-button"
                                            onClick={ ()=>
                                                saveKey(
                                                    this.props.dispatch,
                                                    this.props.routeParams.elaPrivKey,
                                                    this.props.routeParams.history,
                                                    this.props.history
                                                )
                                            }
                                        >
                                            <span className="glyphicon glyphicon-save marg-right-5" />
                                            Save and Login
                                        </button>

                                        <ReactTooltip
                                            className="solidTip"
                                            id="savePrivateKeyTip"
                                            place="top"
                                            type="light"
                                            effect="solid"
                                        >
                                            <span>Print ELA Private Key!</span>
                                        </ReactTooltip>


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
DisplayPrivateKeysELA = connect (mapStateToProps) (DisplayPrivateKeysELA);
export default DisplayPrivateKeysELA;
