import React from "react";
import { Route, Router, IndexRoute, browserHistory } from "react-router";
import App from "./components/App";
import LoginNep2 from "./components/LoginNep2";
import LoginPrivateKey from "./components/LoginPrivateKey";
import Settings from "./components/Settings";
import Changelly from "./components/Exchanges/Changelly.js";
import ShapeShift from "./components/exchanges/ShapeShift";
import SelectExchange from "./components/SelectExchange";
import ExchangeAddress from "./components/ExchangeAddress";
import LoginLocalStorage from "./components/LoginLocalStorage";
import LoginLedgerNanoS from "./components/LoginLedgerNanoS";
import TransactionLedger from "./components/TransactionLedger";
import LedgerNanoSend from "./components/LedgerNanoSend";
import TransactionHistory from "./components/TransactionHistory";
import TransactionHistoryBTC from "./components/TransactionHistoryBTC";
import TransactionHistoryLTC from "./components/TransactionHistoryLTC";
import TransactionHistoryETH  from "./components/TransactionHistoryETH";
import DisplayWalletKeys from "./components/DisplayWalletKeys";
import CreateWallet from "./components/CreateWallet";
import EncryptKey from "./components/EncryptKey";
import Send from "./components/Send";
import Dashboard from "./containers/Dashboard";
import Receive from "./components/Receive";
import Support from "./components/Support";
import Ledger from "./components/Ledger";
import Tokens from "./components/Tokens";
import Sale from "./components/Sale";
import Loopring from "./components/NepTokens/Loopring";
import SendIAM from "./components/NepTokens/SendIAM";
import SendNRVE from "./components/NepTokens/SendNRVE";
import SendZPT from "./components/NepTokens/SendZPT";
import SendTNC from "./components/NepTokens/SendTNC";
import SendTKY from "./components/NepTokens/SendTKY";
import SendONT from "./components/NepTokens/SendONT";
import SendRPX from "./components/NepTokens/SendRPX";
import SendDBC from "./components/NepTokens/SendDBC";
import SendQLC from "./components/NepTokens/SendQLC";
import SendHP from "./components/NepTokens/SendHP";
import SendBTC from "./components/SendBTC";
import SendLTC from "./components/SendLTC";
import SendETH from "./components/SendETH";
import AssetPortfolio from "./components/AssetPortfolio";
import NewBitcoin from "./components/NewBitcoin";
import ReceiveBitcoin from "./components/ReceiveBitcoin";
import NewLitecoin from "./components/NewLitecoin";
import ReceiveLitecoin from "./components/ReceiveLitecoin";
import NewEthereum from "./components/NewEthereum";
import ReceiveEthereum from "./components/ReceiveEthereum";
import LedgerDashboard from "./containers/LedgerDashboard";
import LedgerAssetPortfolio from "./components/LedgerAssetPortfolio";
import AdvancedBitcoin from "./components/AdvancedBitcoin";

export default (
	<Route path="/" component={App}>
		<Route path="/dashboard" component={Dashboard}>
			<Route path="/send" component={Send} />
			<Route path="/loopring" component={Loopring} />
			<Route path="/sendRPX" component={SendRPX} />
			<Route path="/sendDBC" component={SendDBC} />
			<Route path="/sendQLC" component={SendQLC} />
			<Route path="/sendTNC" component={SendTNC} />
			<Route path="/sendTKY" component={SendTKY} />
			<Route path="/sendIAM" component={SendIAM} />
			<Route path="/sendNRVE" component={SendNRVE} />
			<Route path="/sendONT" component={SendONT} />
			<Route path="/sendZPT" component={SendZPT} />
			<Route path="/sendHP" component={SendHP} />
			<Route path="/sendBTC" component={SendBTC} />
			<Route path="/sendLTC" component={SendLTC} />
			<Route path="/sendETH" component={SendETH} />
			<Route path="/receive" component={Receive} />
			<Route path="/settings" component={Settings} />
			<Route path="/selectExchange" component={SelectExchange} />
			<Route path="/changelly" component={Changelly} />
			<Route path="/shapeshift" component={ShapeShift} />
			<Route path="/exchangeAddress" component={ExchangeAddress} />
			<Route path="/ledger" component={Ledger} />
			<Route path="/transactionHistory" component={TransactionHistory} />
			<Route path="/transactionHistoryBTC" component={TransactionHistoryBTC} />
			<Route path="/transactionHistoryLTC" component={TransactionHistoryLTC} />
			<Route path="/transactionHistoryETH" component={TransactionHistoryETH}/>
			<Route path="/support" component={Support} />
			<Route path="/tokens" component={Tokens} />
			<Route path="/sale" component={Sale} />
			<Route path="/assetPortfolio" component={AssetPortfolio} />
			<Route path="/newBitcoin" component={NewBitcoin} />
			<Route path="/receiveBitcoin" component={ReceiveBitcoin} />
			<Route path="/newLitecoin" component={NewLitecoin} />
			<Route path="/receiveLitecoin" component={ReceiveLitecoin} />
			<Route path="/newEthereum" component={NewEthereum}/>
			<Route path="/receiveEthereum" component={ReceiveEthereum}/>
			<Route path="/advancedBitcoin" component={AdvancedBitcoin}/>
		</Route>
		<Route path="/create" component={CreateWallet} />
		<Route path="/encryptKey" component={EncryptKey} />
		<Route path="/DisplayWalletKeys" component={DisplayWalletKeys} />
		<Route path="/LoginNep2" component={LoginNep2} />
		<IndexRoute component={LoginLocalStorage} />

		<Route path="/ledgerDashboard" component={LedgerDashboard}>
      <Route path="/LoginLedgerNanoS" component={LoginLedgerNanoS} />
      <Route path="/TransactionLedger" component={TransactionLedger} />
			<Route path="/LedgerNanoSend" component={LedgerNanoSend} />
			<Route path="/LedgerAssetPortfolio" component={LedgerAssetPortfolio} />
    </Route>

		<Route path="/LoginPrivateKey" component={LoginPrivateKey} />
		<Route path="/LoginEncrypted" component={LoginNep2} />
	</Route>
);
