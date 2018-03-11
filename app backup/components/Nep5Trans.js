import { ASSETS,TOKENS,TOKENS_TEST } from "../core/constants";
import axios from "axios";
import { api,wallet,sc,rpc,u } from "@cityofzion/neon-js";
import { flatMap, keyBy ,get, omit, pick} from "lodash";

const isToken = (symbol) => {
    ![ASSETS.NEO, ASSETS.GAS].includes(symbol)
}

const extractTokens = (sendEntries) => {//: Array<SendEntryType>
    return sendEntries.filter(({ symbol }) => isToken(symbol))
}

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


export {
    makeRequest,
    buildTransferScript,
    buildIntentsForInvocation,
    extractAssets,
    buildIntents,
    extractTokens,
    isToken
};
