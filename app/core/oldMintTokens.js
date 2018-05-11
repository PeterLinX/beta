// @flow
import Neon, { wallet, api, rpc } from '@cityofzion/neon-js';

const neoAssetId =
    'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
const gasAssetId =
    '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
export const oldMintTokens = (
    net,
    scriptHash,
    fromWifOrPublicKey,
    neo,
    gasCost
) => {
    const account = new wallet.Account(fromWifOrPublicKey) // TODO add public key
    const intents = [
      {
        assetId:
        neoAssetId,
        gasAssetId,
        value:
        parseInt(neo),
        scriptHash
      }
    ];
    const invoke = { operation: 'mintTokens', scriptHash, args: [] };
    const rpcEndpointPromise = api.neonDB.getRPCEndpoint(net);
    const balancePromise = api.neonDB.getBalance(net, account.address);
    let signedTx;
    let endpt;
    return Promise.all([rpcEndpointPromise, balancePromise])
        .then(values => {
            endpt = values[0]
            let balances = values[1]
            const unsignedTx = Neon.create.invocationTx(
                balances,
                intents,
                invoke,
                gasCost,
                { version: 1 }
            )
            return unsignedTx.sign(account.privateKey);
        })
        .then(signedResult => {
            signedTx = signedResult;
            return rpc.Query.sendRawTransaction(signedTx).execute(endpt);
        })
        .then(res => {
            if (res.result === true) {
                res.txid = signedTx.hash;
            }
            return res;
        })
}
