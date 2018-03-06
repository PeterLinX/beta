import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { api,wallet,sc,rpc,u } from "@cityofzion/neon-js";
import { doSendAsset, verifyAddress } from "neon-js";
//import Modal from "react-bootstrap-modal";
import axios from "axios";
import SplitPane from "react-split-pane";
import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import deepLogo from "../img/deep.png";
import Claim from "./Claim.js";
import TopBar from "./TopBar";
import Assets from "./Assets";
import { clipboard } from "electron";
import { togglePane } from "../modules/dashboard";
import { TOKENS_TEST } from  "../core/constants";
import  { TOKENS } from  "../core/constants";
import {
	sendEvent,
	clearTransactionEvent,
	toggleAsset
} from "../modules/transactions";
import { flatMap, keyBy ,get, omit, pick} from "lodash";
import {StatusMessage} from "../components/App";

import Modal from "react-modal";
// import {
// 	extractAssets,
// 	isToken,
// 	buildIntents,
// 	buildIntentsForInvocation,
// 	buildTransferScript,
// 	extractTokens,
// 	makeRequest
// } from "./Nep5Trans";

let sendAddress, sendAmount, confirmButton, scriptHash,dbc_usd ,gas_usd;



const apiURL = val => {
	return "https://min-api.cryptocompare.com/data/price?fsym=DBC&tsyms=USD";
};
const apiURLForGas = val => {
    return "https://min-api.cryptocompare.com/data/price?fsym=GAS&tsyms=USD";
};

const isToken = (symbol) => {
    ![ASSETS.NEO, ASSETS.GAS].includes(symbol)
}

// form validators for input fields
const validateForm = (dispatch, neo_balance, gas_balance, asset) => {
	// check for valid address
	try {
		if (
			verifyAddress(sendAddress.value) !== true ||
      sendAddress.value.charAt(0) !== "A"
		) {
			dispatch(sendEvent(false, "The address you entered was not valid."));
			setTimeout(() => dispatch(clearTransactionEvent()), 1000);
			return false;
		}
	} catch (e) {
		dispatch(sendEvent(false, "The address you entered was not valid."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	}
	// check for fractional neo
	if (
		asset === "Neo" &&
    parseFloat(sendAmount.value) !== parseInt(sendAmount.value)
	) {
		dispatch(sendEvent(false, "You cannot send fractional amounts of Neo."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (asset === "Neo" && parseInt(sendAmount.value) > neo_balance) {
		// check for value greater than account balance
		dispatch(sendEvent(false, "You do not have enough NEO to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (asset === "Gas" && parseFloat(sendAmount.value) > gas_balance) {
		dispatch(sendEvent(false, "You do not have enough GAS to send."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	} else if (parseFloat(sendAmount.value) < 0) {
		// check for negative asset
		dispatch(sendEvent(false, "You cannot send negative amounts of an asset."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
		return false;
	}
	return true;
};

// open confirm pane and validate fields
const openAndValidate = (dispatch, neo_balance, gas_balance, asset) => {
	if (validateForm(dispatch, neo_balance, gas_balance, asset) === true) {
		dispatch(togglePane("confirmPane"));
	}
};


const extractAssets = (sendEntries) => {//: Array<SendEntryType>
    return sendEntries.filter(({ symbol }) => !isToken(symbol))
}

const buildIntents = (sendEntries) => {//: Array<SendEntryType>
    const assetEntries = extractAssets(sendEntries)
    // $FlowFixMe
    return flatMap(assetEntries, ({ address, amount, symbol }) =>
        api.makeIntent(
            {
                [symbol]: Number(amount)
            },
            address
        )
    )
}


const buildIntentsForInvocation = (
    sendEntries,//: Array<SendEntryType>,
    fromAddress
) => {
    //const intents = buildIntents(sendEntries)
    const intents = []
    console.log("intents = " + JSON.stringify(intents))

    if (intents.length > 0) {
        return intents
    } else {
        return buildIntents([
            {
                address: fromAddress,
                amount: '0.00000001',
                symbol: ASSETS.GAS
            }
        ])
    }
}


const buildTransferScript = (
    net,
    sendEntries,//: Array<SendEntryType>,
    fromAddress,
    tokensBalanceMap//: {
    //     [key: string]: TokenBalanceType
    // }
) => {
    // const tokenEntries = extractTokens(sendEntries);
    //console.log("tokenEntries = " + tokenEntries);
    const fromAcct = new wallet.Account(fromAddress);
    console.log("fromAcct = " + JSON.stringify(fromAcct));
    const scriptBuilder = new sc.ScriptBuilder();
    console.log("scriptBuilder = " + scriptBuilder);

    sendEntries.forEach(({ address, amount, symbol }) => {
        const toAcct = new wallet.Account(address)
        console.log("toAcct = " + JSON.stringify(toAcct));
        const scriptHash = tokensBalanceMap[symbol].scriptHash;
        console.log("Script Hash = " + scriptHash);
        const decimals = tokensBalanceMap[symbol].decimals;
        console.log("decimals = " + decimals);
        const args = [
            u.reverseHex(fromAcct.scriptHash),
            u.reverseHex(toAcct.scriptHash),
            sc.ContractParam.byteArray(Number(amount), 'fixed8', decimals)
        ]

        scriptBuilder.emitAppCall(scriptHash, 'transfer', args)
    })

    return scriptBuilder.str
}

const makeRequest = (sendEntries, config) => {//: Array<SendEntryType> ,: Object
    console.log("config = " + JSON.stringify(config));
    const script = buildTransferScript(
        config.net,
        sendEntries,
        config.address,
        config.tokensBalanceMap
    )

    console.log("buildTransferScript = " + script);
    return api.doInvoke({
        ...config,
        intents: buildIntentsForInvocation(sendEntries, config.address),
        script,
        gas: 0
    })
}
// perform send transaction for DBC
const sendDbcTransaction = async (
    dispatch,
    net,
    selfAddress,
    wif
) => {
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log("endpoint = "+endpoint);
    let script;
    if (net == "MainNet") {
        script = TOKENS.DBC;
    } else {
        script = TOKENS_TEST.DBC;
    }
    const token_response = await api.nep5.getToken(endpoint, script, selfAddress);
    const  dbc_balance = token_response.balance;
    console.log("token_response = " + JSON.stringify(token_response))
    const tokenBalances = {
        name: token_response.name,
        symbol: token_response.symbol,
        decimals: token_response.decimals,
        totalSupply: token_response.totalSupply,
        balance: token_response.balance,
        scriptHash: script
    };
    const tokensBalanceMap = {
        DBC: tokenBalances
    }//keyBy(tokenBalances, 'symbol');
    console.log("tokensBalanceMap = " + JSON.stringify(tokensBalanceMap));
    let privateKey = new wallet.Account(wif).privateKey
    let publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
    console.log("public Key = " + publicKey);
    //sendEntries ,// Array<SendEntryType>,
    let sendEntries = new Array();
    var sendEntry = {
        amount: sendAmount.value.toString(),
        address: sendAddress.value.toString(),
        symbol: 'DBC'
    }
    sendEntries.push(sendEntry);
    console.log("sendEntries = " + JSON.stringify(sendEntries));
    if (dbc_balance <= sendAmount.value) {
        dispatch(sendEvent(false,"The Dbc amount is not enough."))
    } else {
        console.log("Sending DBC...\n");
        try{
            const { response } = await makeRequest(sendEntries,{
                net,
                tokensBalanceMap,
                address:selfAddress,
                undefined,
                privateKey: privateKey,
                signingFunction: null
            })

            console.log("sending dbc response="+response.result);
            if (!response.result) {
                dispatch(sendEvent(false, "Transaction failed for DBC!"));
            }
            else {
                dispatch(sendEvent(false, "Transaction complete! Your balance will automatically update when the blockchain has processed it."));
            }

        } catch(err) {
            console.log("sending dbc ="+err.message);
            dispatch(sendEvent(false, "Transaction failed for DBC!"));
        }
    }
}



class SendDBC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			gas: 0,
			neo: 0,
			neo_usd: 0,
			gas_usd: 0,
			value: 0,
			inputEnabled: true,
            statusMessage: "Test message",
			modalStatus: false
		};
		this.handleChangeNeo = this.handleChangeNeo.bind(this);
		this.handleChangeGas = this.handleChangeGas.bind(this);
		this.handleChangeUSD = this.handleChangeUSD.bind(this);
	}

	async componentDidMount() {
		let neo = await axios.get(apiURL("NEO"));
		let gas = await axios.get(apiURL("GAS"));
		neo = neo.data.USD;
		gas = gas.data.USD;
		this.setState({ neo: neo, gas: gas });
	}

	handleChangeNeo(event) {
		this.setState({ value: event.target.value }, (sendAmount = value));
		const value = event.target.value * this.state.neo;
		this.setState({ neo_usd: value });
	}

	handleChangeGas(event) {
		this.setState({ value: event.target.value }, (sendAmount = value));
		const value = event.target.value * this.state.gas;
		this.setState({ gas_usd: value });
	}

	async handleChangeUSD(event) {
		this.setState({ gas_usd: event.target.value });

		let gas = await axios.get(apiURL("GAS"));
		gas = gas.data.USD;
		this.setState({ gas: gas });
		console.log("done");
		const value = this.state.gas_usd / this.state.gas;
		this.setState({ value: value }, (sendAmount = value));
	}

	render() {
		const {
			dispatch,
			wif,
			address,
			status,
			neo,
			gas,
			net,
			confirmPane,
			selectedAsset
		} = this.props;
		let confirmPaneClosed;
		let open = true;
		if (confirmPane) {
			confirmPaneClosed = "100%";
			open = true;
		} else {
			open = false;
			confirmPaneClosed = "69%";
		}

		let btnClass;
		let formClass;
		let priceUSD = 0;
		let gasEnabled = false;
		let inputEnabled = true;
		let convertFunction = this.handleChangeNeo;
		if (selectedAsset === "Neo") {
			btnClass = "btn-send";
			convertFunction = this.handleChangeNeo;
			formClass = "form-send-dbc";
			priceUSD = this.state.neo_usd;
			inputEnabled = true;
		} else if (selectedAsset === "Gas") {
			gasEnabled = true;
			inputEnabled = false;
			btnClass = "btn-send-gas";
			formClass = "form-send-gas";
			priceUSD = this.state.gas_usd;
			convertFunction = this.handleChangeGas;
		}


		return (
			<div>
                {
                    this.state.modalStatus ?
						<StatusMessage
							statusMessage={this.state.statusMessage}
							onConfirm={
                                () => {
                                    sendDbcTransaction(
                                        dispatch,
                                        net,
                                        address,
                                        wif
                                    );
                                    this.setState({modalStatus: false});
                                }
                            }
							onCancel = {
                                () => {
                                    this.setState({modalStatus: false});
                                }
                            }
						/> : null
                }

				<Assets />
				<div id="send">

					<div className="row dash-chart-panel">
						<div className="col-xs-9">
							<img
								src={deepLogo}
								alt=""
								width="48"
								className="neo-logo fadeInDown"
							/>
							<h2> Send DeepBrain Tokens</h2>
						</div>

						<div className="col-xs-3 top-20 center com-soon">
            Block: {this.props.blockHeight}
						</div>

						<div className="col-xs-12 center">
							<hr className="dash-hr-wide top-20" />
						</div>

						<div className="clearboth" />

						<div className="top-20">
							<div className="col-xs-9">
								<input
									className={formClass}
									id="center"
									placeholder="Enter a valid DBC public address here"
									ref={node => {
										sendAddress = node;
									}}
								/>
							</div>

							<div className="col-xs-3">
								<Link to="/send">
									<div className="blue-button">
                      DBC
									</div>
								</Link>
							</div>

							<div className="col-xs-5  top-20">
								<input
									className={formClass}
									type="number"
									id="assetAmount"
									min="1"
									onChange={convertFunction}
									value={this.state.value}
									placeholder="Enter amount to send"
									ref={node => {
										sendAmount = node;
									}}
								/>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Amount in DBC to send</span>
							</div>
							<div className="col-xs-4 top-20">
								<input
									className={formClass}
									id="sendAmount"
									onChange={this.handleChangeUSD}
									onClick={this.handleChangeUSD}
									disabled={gasEnabled === false ? true : false}
									placeholder="Amount in US"
									value={`${priceUSD}`}
								/>
								<label className="amount-dollar">$</label>
								<div className="clearboth"/>
								<span className="com-soon block top-10">Calculated in USD</span>
							</div>
							<div className="col-xs-3 top-20">
								<div id="sendAddress">
									<button
										className="dbc-button"
										onClick={() =>
											this.setState({
												modalStatus: true,
                                                statusMessage: "Please confirm transaction of "
                                                + sendAmount.value.toString()+" DBC to "
                                                + address.toString() + ".\n"
                                                + "Network Fees = " + parseFloat(sendAmount.value/10).toString() + "DBC"
											})
										}
										ref={node => {
											confirmButton = node;
										}}
									>
										<span className="glyphicon glyphicon-send marg-right-5"/>  Send
									</button>
								</div>
							</div>

						</div>
					</div>

					<div className="send-notice">
						<p>
              Sending DeepBrain requires a balance of 1 GAS+. Only send DBC to a valid address that supports NEP tokens on the NEO blockchain. When sending DBC to an exchange please ensure the address supports DBC tokens.
						</p>
						<div className="col-xs-2 top-20"/>
						<div className="col-xs-8 top-20">
							<p className="center donations"
								data-tip
								data-for="donateTip"
								onClick={() => clipboard.writeText("AG3p13w3b1PT7UZtsYBoQrt6yjjNhPNK8b")}
							>Morpheus Dev Team: AG3p13w3b1PT7UZtsYBoQrt6yjjNhPNK8b</p>
							<ReactTooltip
								className="solidTip"
								id="donateTip"
								place="top"
								type="light"
								effect="solid"
							>
								<span>Copy address to send donation</span>
							</ReactTooltip>
						</div>
					</div>

				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	wif: state.account.wif,
	address: state.account.address,
	net: state.metadata.network,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	selectedAsset: state.transactions.selectedAsset,
	confirmPane: state.dashboard.confirmPane
});

SendDBC = connect(mapStateToProps)(SendDBC);

export default SendDBC;
