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

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://live.blockcypher.com/ltc/address/";
	} else {
		base = "https://live.blockcypher.com/ltc-testnet/address/";
	}
	return base + address;
};

let key_name;

const saveKey = async (dispatch, privKey, history,selfHistory) => {
    console.log("starting to save LTC private key");
    if (key_name === undefined || key_name.value === '') {
        dispatch(sendEvent(false, "Please input name!"));
	} else {
        await storage.get("ltckeys" , async (error, data) => {
            data[key_name.value] = privKey;
            dispatch(sendEvent(true, "Saved LTC private key as " + key_name.value));
            await storage.set("ltckeys", data, function (error) {
                if (error) console.log(error);
            });
            await setTimeout(() => dispatch(clearTransactionEvent()),3000);
            setTimeout(() => selfHistory.push("/newLitecoin"),3000);
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

class DisplayPrivateKeysLTC extends Component {
    componentDidMount = () => {
        console.log('DisplayPrivateKeysLTC mounted')
        console.log(JSON.stringify(this.props));
        QRCode.toCanvas(
           this.publicCanvas,
           this.props.routeParams.ltc_address,
            { version: 5},
            err => {
               if (err) console.log(err);
            }
        );

        QRCode.toCanvas(
            this.privateCanvas,
            this.props.routeParams.ltcPrivKey,
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
                      src={litecoinLogo}
                      alt=""
                      width="44"
                      className="neo-logo logobounce"
                    />
                     <h2>Save Litecoin Private Key</h2>
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
                                             <p className="key-label">Your LTC Private Key</p>
                                             <input
                                                 type="text"
                                                 className="form-control"
                                                 contentEditable={false}
                                                 readOnly={true}
                                                 value={this.props.routeParams.ltcPrivKey}
                                                 data-tip
                                                 data-for="copyPrivateKeyTip"
                                                 onClick={() => clipboard.writeText(this.props.routeParams.ltcPrivKey)}
                                             />
                                     			</div>

																		 <div className="col-xs-6">
		                                     <p className="key-label">
		                                         Name your LTC private key:
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

                             </div>

														 <div className="private">
		                             <div className="keyList">
		                              <div className="col-xs-8 top-20">
																		 <p>
																		 					Your Litecoin privqte key gives you full control of your Litecoin address. Morpheus can not assist you recover a lost private key or funds. Back up your private key before proceeding. Click save to access your Litecoin Public Address.
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
																										 this.props.routeParams.ltcPrivKey,
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
																						 <span>Print LTC Private Key!</span>
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
DisplayPrivateKeysLTC = connect (mapStateToProps) (DisplayPrivateKeysLTC);
export default DisplayPrivateKeysLTC;
