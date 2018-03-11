import React, { Component } from "react";
import { Link } from "react-router";
import QRCode from "qrcode";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import storage from "electron-json-storage";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import EthLogo from  "../img/eth.png";

let key_name;

const saveKey = async (dispatch, privKey, history) => {
    console.log("starting to save ETH private key");
    await storage.get("ethkeys" , async (error, data) => {
        data[key_name.value] = privKey;
        dispatch(sendEvent(true, "Saved ETH private key as " + key_name.value));
        await storage.set("ethkeys", data, function (error) {
            if (error) console.log(error);
        });
        await setTimeout(() => dispatch(clearTransactionEvent()),3000);
        setTimeout(() => history.push("/"),3000);
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
            <div className="displayWalletKeys">
                <div className="row send-neo-wide">
                    <div className="row">
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
                                    <div className="ketList">
                                        {}
                                        <div className="keyListItem">
                                             <span className="wallet-logo">
                                                 <EthLogo width={"24"} />
                                             </span>{" "}
                                            <h3>New ETH Address Created</h3>
                                            <input
                                                type="text"
                                                onClick={ () => clipboard.writeText(this.props.routeParams.eth_address)}
                                                className="form-control pubicAddress font-plus"
                                                contentEditable={false}
                                                readOnly={true}
                                                value={this.props.routeParams.eth_address}
                                                placeholder={this.props.routeParams.eth_address}
                                                data-tip
                                                data-for="copyPublicAddressTip"
                                            />
                                        </div>

                                        <div className="keyListItem">
                                            <p className="key-label">Your ETH Private Key</p>
                                            <input
                                                type="text"
                                                className="form-control"
                                                contentEditable={false}
                                                readOnly={true}
                                                value={this.props.ethPrivKey}
                                                data-tip
                                                data-for="copyPrivateKeyTip"
                                                onClick={() => clipboard.writeText(this.props.routeParams.ethPrivKey)}
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
                                        <span>Copy your ETH public address</span>
                                    </ReactTooltip>

                                    <ReactTooltip
                                        className="solidTip"
                                        id="copyPrivateKeyTip"
                                        place="top"
                                        type="light"
                                        effect="solid"
                                    >
                                        <span>Copy your ETH private key</span>
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
                                <div className="col-xs-8 top-20">
                                    <p className="key-label">
                                        Please input name to save private key:
                                    </p>
                                    <input
                                        type="text"
                                        className="form-control saveKey font-plus"
                                        ref={node => (key_name = node)}
                                        placeholder="Name your saved address"
                                        data-tip
                                    />
                                </div>

                                <div className="col-xs-4 top-20">
                                    <button
                                        data-tip
                                        data-for="printTip"
                                        onClick={ ()=>
                                            saveKey(
                                                this.props.dispatch,
                                                this.props.routeParams.ethPrivKey,
                                                this.props.routeParams.history
                                            )
                                        }
                                    >

                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({});
DisplayPrivateKeysETH = connect (mapStateToProps) (DisplayPrivateKeysETH);
export default DisplayPrivateKeysETH;