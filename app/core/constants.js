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
	ACAT: '7f86d61ff377f1b12e589a5907152b57e2ad9a7a',
	CGE: '34579e4614ac1a7bd295372d3de8621770c76cdc',
	DBC: 'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
	GALA: '9577c3f972d769220d69d1c4ddbd617c44d067aa',
	IAM: '891daf0e1750a1031ebe23030828ad7781d874d6',
	NRVE: 'a721d5893480260bd28ca1f395f2c465d0b5b1c2',
	ONT: 'ceab719b8baa2310f232ee0d277c061704541cfb',
	OBT: '0e86a40588f715fcaf7acd1812d50af478e6e917',
	RHT: '2328008e6f6c7bd157a342e789389eb034d9cbc4',
	RPX: 'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9',
	QLC: '0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5',
	SWH: '78e6d16b914fe15bc16150aeb11d0c2a8e532bdd',
	THOR: '67a5086bac196b67d5fd20745b0dc9db4d2930ed',
	TKY: '132947096727c84c7f9e076c90f08fec3bc17f18',
	TNC: '08e8c4400f1af2c20c28e0018f29535eb85d15b6',
	ZPT: 'ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5'
};

// MainNet
export const TOKENS = {
	ACAT: '7f86d61ff377f1b12e589a5907152b57e2ad9a7a',
	CGE: '34579e4614ac1a7bd295372d3de8621770c76cdc',
	DBC: 'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
	GALA: '9577c3f972d769220d69d1c4ddbd617c44d067aa',
	IAM: '891daf0e1750a1031ebe23030828ad7781d874d6',
	NRVE: 'a721d5893480260bd28ca1f395f2c465d0b5b1c2',
	ONT: 'ceab719b8baa2310f232ee0d277c061704541cfb',
	OBT: '0e86a40588f715fcaf7acd1812d50af478e6e917',
	RHT: '2328008e6f6c7bd157a342e789389eb034d9cbc4',
	RPX: 'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9',
	QLC: '0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5',
	SWH: '78e6d16b914fe15bc16150aeb11d0c2a8e532bdd',
	THOR: '67a5086bac196b67d5fd20745b0dc9db4d2930ed',
	TKY: '132947096727c84c7f9e076c90f08fec3bc17f18',
	TNC: '08e8c4400f1af2c20c28e0018f29535eb85d15b6',
	ZPT: 'ac116d4b8d4ca55e6b6d4ecce2192039b51cccc5'
};

export const TOKEN_SCRIPT_TEST = [
	{token: "Orbis (OBT)", hashscript: '0e86a40588f715fcaf7acd1812d50af478e6e917'},
  {token: "Thor (THOR)", hashscript: '67a5086bac196b67d5fd20745b0dc9db4d2930ed'},
	{token: "Switcheo (SWH)", hashscript: '78e6d16b914fe15bc16150aeb11d0c2a8e532bdd'},
];

export const TOKEN_SCRIPT = [
	{token: "Orbis (OBT)", hashscript: '0e86a40588f715fcaf7acd1812d50af478e6e917'},
  {token: "Thor (THOR)", hashscript: '67a5086bac196b67d5fd20745b0dc9db4d2930ed'},
	{token: "Switcheo (SWH)", hashscript: '78e6d16b914fe15bc16150aeb11d0c2a8e532bdd'},
];

export  const BLOCK_TOKEN = "9ba58edd979a467a96f361a45b040b75";
export const FINDING_LEDGER_NOTICE = "Looking for USB Devices. Please plugin your device and login.";
