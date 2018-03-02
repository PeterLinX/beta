import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getBalance,
  getTransactionHistory,
  getClaimAmounts,
  getWalletDBHeight,
  getAPIEndpoint
} from "neon-js";
import { api,wallet } from "@cityofzion/neon-js";
import Neon from "@cityofzion/neon-js";
import { setClaim } from "../modules/claim";
import { setBlockHeight, setNetwork } from "../modules/metadata";
import {
    setBalance,
    setMarketPrice,
    resetPrice,
    setBtcBalance,
    setTransactionHistory,
    setBtcTransactionHistory,
    setLtcTransactionHistory, setLtcBalance
} from "../modules/wallet";
import { version } from "../../package.json";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import axios from "axios";
import {TOKENS_TEST} from "../core/constants";
import {TOKENS} from "../core/constants";

let intervals = {};
let dbcScriptHash, ontScriptHash, qlcScriptHash, rpxScriptHash, rhptScriptHash, tkyScriptHash, zptScriptHash;
let netSelect;

// https://bittrex.com/api/v1.1/public/getmarkethistory?market=BTC-NEO

// putting this back in wallet, does not belong in neon-js
export const getMarketPriceUSD = amount => {
  return axios
    .get("https://bittrex.com/api/v1.1/public/getticker?market=USDT-NEO")
    .then(response => {
      let lastUSDNEO = Number(response.data.result.Last);
      return lastUSDNEO * amount;
    });
};


const getOntBalance = async (net,address) => {
    let ont_token;
    if (net === "MainNet") {
        ont_token = TOKENS.ONT;
    } else {
        ont_token = TOKENS_TEST.ONT;
    }
    return getBalace(net,address,ont_token);
}


const getDbcBalance = async (net,address) => {
    let dbc_token;
    if (net === "MainNet") {
        dbc_token = TOKENS.DBC;
    } else {
        dbc_token = TOKENS_TEST.DBC;
    }
    return getBalace(net,address,dbc_token);
}

const getQlcBalance = async (net,address) => {
    let qlc_token;
    if (net === "MainNet") {
        qlc_token = TOKENS.QLC;
    } else {
        qlc_token = TOKENS_TEST.QLC;
    }
    return getBalace(net,address,qlc_token);
}

const getRpxBalance = async (net,address) => {
    let rpx_token;
    if (net === "MainNet") {
        rpx_token = TOKENS.RPX;
    } else {
        rpx_token = TOKENS_TEST.RPX;
    }
    return getBalace(net,address,rpx_token);
}

const getTkyBalance = async (net,address) => {
    let tky_token;
    if (net === "MainNet") {
        tky_token = TOKENS.TKY;
    } else {
        tky_token = TOKENS_TEST.TKY;
    }
    return getBalace(net,address,tky_token);
}

const getZptBalance = async (net,address) => {
    let zpt_token;
    if (net === "MainNet") {
        zpt_token = TOKENS.ZPT;
    } else {
        zpt_token = TOKENS_TEST.ZPT;
    }
    return getBalace(net,address,zpt_token);
}

const getBalace = async (net,address,token) => {
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log("endpoint = "+endpoint);
    const  scriptHash  = token;
    try {
        const response = await api.nep5.getToken(endpoint, scriptHash, address);
        console.log("nep5 balance response = "+JSON.stringify(response));
        return response.balance;
    } catch (err) {
        // invalid scriptHash
        console.log("invalid scriptHash")
        return 0;
    }
}

const getBalanceFromApi = async (scriptHash,address) => {
    api.nep5.getTokenBalance("http://seed3.neo.org:10332",scriptHash,address)
    .then(response =>{
        console.log(JSON.stringify(response));
        let rpxBal = Number(response);
        return rpxBal;
    })
    .catch(error =>{
      console.log("rpx balance\n")
       console.log(error.message);
    });
}

const getGasPrice = async gasVal => {
  try {
    let gas = await axios.get("https://api.coinmarketcap.com/v1/ticker/gas/");
    gas = gas.data[0].price_usd;
    const value = gasVal * gas;
    return value;
  } catch (error) {
    console.log(error);
  }
};

const getMarketPrice = async () => {
  try {
    let marketPrices = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=GAS,NEO,BTC,DBC,ELA,ETH,LTC,LRC,QLC,RPX,TNC,TKY,XMR,ELA,ZPT&tsyms=USD"
    );
    console.log("market price="+JSON.stringify(marketPrices));
    return marketPrices;
  } catch (error) {
    console.log(error);
  }
};

const getLtcOutputTransactions = async (net,address) => {
    let base;
    if(net === "MainNet") {
        base = "https://api.blockcypher.com/v1/ltc/main/txs/" + address;
    } else {
        base = "https://api.blockcypher.com/v1/ltc/test3/txs/" + address;
    }

    let response = await axios.get(base);
    return response.data.outputs;
}

const getLtcInputTransactions = async (net,address) => {
    let base;
    if(net === "MainNet") {
        base = "https://api.blockcypher.com/v1/ltc/main/txs/" + address;
    } else {
        base = "https://api.blockcypher.com/v1/ltc/test3/txs/" + address;
    }

    let response = await axios.get(base);
    return response.data.inputs;
}


const getBtcTransactions =  async (net,address) => {
    let base;
    console.log("bitcoin address : " + address);
    if(net == "MainNet") {
        base = "https://blockexplorer.com/api/txs/?address="+address;
    }	else {
        base = "https://testnet.blockexplorer.com/api/txs/?address="+address;
    }

    console.log("base url:" + base);
    let response = await axios.get(base);
    console.log(JSON.stringify(response.data.txs));
    return response.data.txs;
};

const syncLtcTransactionHistory = async (dispatch,net,address) => {
    let txs = [];
    let input_transactions = await getLtcInputTransactions(net,address);
    let output_transactions = await  getLtcOutputTransactions(net,address);
    for (let i = 0; i < input_transactions.length; i++) {
        txs = txs.concat([
            {
                type: "LTC",
                amount: parseFloat(input_transactions[i].value/100000000),
                txid: input_transactions[i].txid,
                block_index: input_transactions[i].block_index
            }
        ]);
    }

    for(let j = 0; j<output_transactions.length ;j++) {
        txs = txs.concat([
            {
                type: "LTC",
                amount: parseFloat(input_transactions[i].value/100000000),
                txid: input_transactions[i].txid,
                block_index: input_transactions[i].block_index
            }
        ]);
    }

}

const  getInputVal = (vinlist , addr) => {
    for (let j = 0; j < vinlist.length ; j++) {
        if (addr === vinlist[j].addr) {
            let amount = parseFloat((-1) * vinlist[j].value);
            return amount;
        }
    }
    return null;
}

const getOutputVal = (voutlist , addr) => {
    for (let k = 0 ;k <voutlist.length ; k++) {
        if (addr === voutlist[k].scriptPubKey.addresses[0]) {
            let amount = parseFloat(voutlist[k].value);
            return amount;
        }
    }
    return null;
}

const syncBtcTransactionHistory = async (dispatch,net,address) => {
    console.log("Start get btc transactions history\n");
    let amount;
    let txs = [];
    let transactions = await getBtcTransactions(net,address);
    console.log(transactions);

    for (let i = 0; i < transactions.length; i++) {
        let vinlist = transactions[i].vin;
        let voutlist = transactions[i].vout;
        let input_amount = getInputVal(vinlist , address);
        let output_amount = getOutputVal(voutlist , address);

        if (input_amount !== null) {
            amount = input_amount;
        } else if (output_amount !== null) {
            amount = output_amount;
        } else {
            amount  = 0;
        }
        txs = txs.concat([
            {
                type: "BTC",
                amount: amount,
                txid: transactions[i].txid,
                block_index: transactions[i].block_index
            }
        ]);
    }
    dispatch(setBtcTransactionHistory(txs));

}

const initiateLtcGetBalance = async (dispatch, net, ltc_address) => {
    let base;
    syncLtcTransactionHistory(dispatch,net,ltc_address);

    if (net === "MainNet") {
        base = "http://api.blockcypher.com/v1/btc/main/addrs/";
    } else {
        base = "http://api.blockcypher.com/v1/btc/test3/addrs/";
    }

    let response = await axios.get(base+ltc_address);

    if (response.balance !== undefined) {
        setLtcBalance(parseFloat(repsonse.balance/100000000));
    }
}

const initiateBtcGetBalance = async (dispatch, net, btc_address) => {
    let base;
    syncBtcTransactionHistory(dispatch ,net ,btc_address);

    if (net === "MainNet") {
        base = "http://api.blockcypher.com/v1/btc/main/addrs/";
    } else {
        base  = "http://api.blockcypher.com/v1/btc/test3/addrs/";
    }

    let repsonse = await axios.get(base+btc_address);
    if (response !== undefined) {
        setBtcBalance(parseFloat(repsonse.balance/100000000));
    }
}
// TODO: this is being imported by Balance.js, maybe refactor to helper file/

const initiateGetBalance = (dispatch, net, address) => {
  syncTransactionHistory(dispatch, net, address);
  syncAvailableClaim(dispatch, net, address);
  syncBlockHeight(dispatch, net);

  if (net == "MainNet") {
      rpxScriptHash = Neon.CONST.CONTRACTS.RPX;
      dbcScriptHash = Neon.CONST.CONTRACTS.DBC;
      zptScriptHash = Neon.CONST.CONTRACTS.ZPT;
  } else {
      rpxScriptHash = Neon.CONST.CONTRACTS.TEST_RPX;
      dbcScriptHash = Neon.CONST.CONTRACTS.TEST_DBC;
  }

  return getBalance(net, address)
    .then(resultBalance => {
      return getMarketPriceUSD(resultBalance.Neo)
        .then(async resultPrice => {
          if (resultPrice === undefined || resultPrice === null) {
            dispatch(setBalance(resultBalance.Neo, resultBalance.Gas, "--"));
          } else {
            let gasPrice = await getGasPrice(resultBalance.Gas);
            let marketPrices = await getMarketPrice();
            let combinedPrice = gasPrice + resultPrice;
            //let rpxBal = await getBalanceFromApi(rpxScriptHash,address);

            let dbcBalance = await getDbcBalance(net,address);
            console.log("dbc balance= " + dbcBalance);

            let ontBalance = await getOntBalance(net,address);
            console.log("ont balance= " + ontBalance);

            let qlcBalance = await getQlcBalance(net,address);
            console.log("qlc balance= " + qlcBalance);

            let rpxBalance = await getRpxBalance(net,address);
            console.log("rpx balance= " + rpxBalance);

            let tkyBalance = await getTkyBalance(net,address);
            console.log("tky balance= " + tkyBalance);

            let zptBalance = await getZptBalance(net,address);
            console.log("zpt balance= " + zptBalance);

            dispatch(
              setBalance(
                resultBalance.Neo,
                resultBalance.Gas,
                dbcBalance,
                ontBalance,
                qlcBalance,
                rpxBalance,
                tkyBalance,
                zptBalance,
                resultPrice,
                combinedPrice,
                gasPrice,
                marketPrices.data.GAS.USD,
                marketPrices.data.NEO.USD,
                marketPrices.data.BTC.USD,
                marketPrices.data.DBC.USD,
                marketPrices.data.ELA.USD,
                marketPrices.data.ETH.USD,
                marketPrices.data.LTC.USD,
                marketPrices.data.LRC.USD,
                marketPrices.data.QLC.USD,
                marketPrices.data.RPX.USD,
                marketPrices.data.TNC.USD,
                marketPrices.data.TKY.USD,
                marketPrices.data.XMR.USD,
                marketPrices.data.ZPT.USD,

              )
            );
          }
          return true;
        })
        .catch(e => {
          dispatch(setBalance(resultBalance.Neo, resultBalance.Gas, "--"));
        });
    })
    .catch(result => {
      // If API dies, still display balance
    });
};

const syncAvailableClaim = (dispatch, net, address) => {
  getClaimAmounts(net, address).then(result => {
    //claimAmount / 100000000
    dispatch(setClaim(result.available, result.unavailable));
  });
};

const syncBlockHeight = (dispatch, net) => {
  getWalletDBHeight(net).then(blockHeight => {
    dispatch(setBlockHeight(blockHeight));
  });
};

const syncTransactionHistory = (dispatch, net, address) => {
  getTransactionHistory(net, address).then(transactions => {
    let txs = [];
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].neo_sent === true) {
        txs = txs.concat([
          {
            type: "NEO",
            amount: transactions[i].NEO,
            txid: transactions[i].txid,
            block_index: transactions[i].block_index
          }
        ]);
      }
      if (transactions[i].gas_sent === true) {
        txs = txs.concat([
          {
            type: "GAS",
            amount: transactions[i].GAS,
            txid: transactions[i].txid,
            block_index: transactions[i].block_index
          }
        ]);
      }
    }
    dispatch(setTransactionHistory(txs));
  });
};

const resetBalanceSync = (dispatch, net, address) => {
  if (intervals.balance !== undefined) {
    clearInterval(intervals.balance);
  }
  intervals.balance = setInterval(() => {
    initiateGetBalance(dispatch, net, address);
  }, 30000);
};

const toggleNet = (dispatch, net, address) => {
  let newNet;
  if (net === "MainNet") {
    newNet = "TestNet";
  } else {
    newNet = "MainNet";
  }
  dispatch(setNetwork(newNet));
  resetBalanceSync(dispatch, newNet, address);
  if (address !== null) {
    initiateGetBalance(dispatch, newNet, address);
  }
};

class NetworkSwitch extends Component {
  componentDidMount = () => {
    resetBalanceSync(this.props.dispatch, this.props.net, this.props.address);
  };
  render = () => (
    <div
      id="network"
      onClick={() =>
        toggleNet(this.props.dispatch, this.props.net, this.props.address)
      }
    >
      <div className="dash-icon-bar">
        <div className="icon-border">
          <span className="glyphicon glyphicon-exclamation-sign" />
        </div>
        <span className="transparent">Running on </span>
        <span className="netName">{this.props.net}</span>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  net: state.metadata.network,
  address: state.account.address
});

NetworkSwitch = connect(mapStateToProps)(NetworkSwitch);

export {
  NetworkSwitch,
  initiateGetBalance,
  syncTransactionHistory,
  syncBtcTransactionHistory,
  initiateBtcGetBalance,
  initiateLtcGetBalance,
  intervals,
  resetBalanceSync
};
