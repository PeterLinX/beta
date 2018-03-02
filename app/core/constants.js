// @flow
export const NEON_WALLET_RELEASE_LINK = "https://github.com/MorpheusWallet/Morpheus/releases";

export const NETWORK = {
	MAIN: "MainNet",
	TEST: "TestNet"
};

export const EXPLORER = {
	NEO_TRACKER: "Neotracker",
	NEO_SCAN: "Neoscan",
	ANT_CHAIN: "Antchain"
};

export const ASSETS = {
	NEO: "NEO",
	GAS: "GAS"
};

export const ASSETS_LABELS = {
	[ASSETS.NEO]: "Neo",
	[ASSETS.GAS]: "Gas"
};

export const ROUTES = {
	DASHBOARD: "/dashboard"
};

export const NOTIFICATION_LEVELS = {
	ERROR: "error",
	SUCCESS: "success",
	INFO: "info",
	WARNING: "warning"
};

export const NOTIFICATION_POSITIONS = {
	TOP_CENTER: "tc",
	TOP_RIGHT: "tr",
	TOP_LEFT: "tl",
	BOTTOM_CENTER: "bc",
	BOTTOM_RIGHT: "br",
	BOTTOM_LEFT: "bl"
};

export const BIP44_PATH =
  "8000002C" +
  "80000378" +
  "80000000" +
  "00000000" +
  "00000000";

export const MODAL_TYPES = {
	SEND_TRANSACTION: "SEND_TRANSACTION",
	CONFIRM: "CONFIRM",
	SEND: "SEND",
	RECEIVE: "RECEIVE"
};

// TestNet
export const TOKENS_TEST = {
	DBC: "b951ecbbc5fe37a9c280a76cb0ce0014827294cf",
	ONT: "ceab719b8baa2310f232ee0d277c061704541cfb",
	RPX: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
	QLC: "0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5",
	TKY: "132947096727c84c7f9e076c90f08fec3bc17f18",
	ZPT: "ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5",
};

// MainNet
export const TOKENS = {
	DBC: "b951ecbbc5fe37a9c280a76cb0ce0014827294cf",
	ONT: "ceab719b8baa2310f232ee0d277c061704541cfb",
	RPX: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
	QLC: "0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5",
	TKY: "132947096727c84c7f9e076c90f08fec3bc17f18",
	ZPT: "ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5",

};

export  const BLOCK_TOKEN = "9ba58edd979a467a96f361a45b040b75";
export const FINDING_LEDGER_NOTICE = "Looking for USB Devices. Please plugin your device and login.";
