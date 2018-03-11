// Constants
export const SET_HEIGHT = "SET_HEIGHT";
export const SET_BTC_HEIGHT = "SET_BTC_HEIGHT";
export const SET_LTC_HEIGHT = "SET_LTC_HEIGHT";
export const SET_ETH_HEIGHT = "SET_ETH_HEIGHT";
export const SET_NETWORK = "SET_NETWORK";
export const SET_EXPLORER = "SET_EXPLORER";

// Actions
export function setNetwork(net) {
	const network =
	net === "MainNet"
		? "MainNet"
		: net === "MainNet-A"
			? "MainNet-A"
			: net === "TestNet-A" ? "TestNet-A" : "TestNet";
	return {
		type: SET_NETWORK,
		net: network
	};
}

export function setEthBlockHeight(ethBlockHeight) {
    return {
        type: SET_ETH_HEIGHT,
        ethBlockHeight
    };
}

export function setBtcBlockHeight(btcBlockHeight) {
	return {
		type: SET_BTC_HEIGHT,
        btcBlockHeight
	};
}

export function setLtcBlockHeight(ltcBlockHeight) {
    return {
        type: SET_LTC_HEIGHT,
        ltcBlockHeight
    };
}

export function setBlockHeight(blockHeight) {
	return {
		type: SET_HEIGHT,
		blockHeight
	};
}

export function setBlockExplorer(blockExplorer) {
	return {
		type: SET_EXPLORER,
		blockExplorer
	};
}

// reducer for metadata associated with Neon
export default (
	state = { blockHeight: 0, network: "MainNet", blockExplorer: "Neotracker" ,btcBlockHeight: 0, ltcBlockHeight: 0, ethBlockHeight: 0},
	action
) => {
	switch (action.type) {
	case SET_HEIGHT:
		return { ...state, blockHeight: action.blockHeight };
	case SET_EXPLORER:
		console.log(action.blockExplorer);
		return { ...state, blockExplorer: action.blockExplorer };
	case SET_NETWORK:
		return { ...state, network: action.net };
	case SET_BTC_HEIGHT:
		return {...state, btcBlockHeight: action.btcBlockHeight };
	case SET_LTC_HEIGHT:
		return {...state, ltcBlockHeight: action.ltcBlockHeight };
	case SET_ETH_HEIGHT:
        return {...state, ethBlockHeight: action.ethBlockHeight };
	default:
		return state;
	}
};
