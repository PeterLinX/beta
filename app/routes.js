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
import TransactionHistoryLRC from "./components/TransactionHistoryLRC";
import TransactionHistoryEOS from "./components/TransactionHistoryEOS";
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
import SendSWH from "./components/NepTokens/SendSWH";
import SendACAT from "./components/NepTokens/SendACAT";
import SendAPEX from "./components/NepTokens/SendAPEX";
import SendEDS from "./components/NepTokens/SendEDS";
import SendEFX from "./components/NepTokens/SendEFX";
import SendOBT from "./components/NepTokens/SendOBT";
import SendCGE from "./components/NepTokens/SendCGE";
import SendGDM from "./components/NepTokens/SendGDM";
import SendGAGA from "./components/NepTokens/SendGAGA";
import SendLRN from "./components/NepTokens/SendLRN";
import SendAPH from "./components/NepTokens/SendAPH";
import SendIAM from "./components/NepTokens/SendIAM";
import SendNRVE from "./components/NepTokens/SendNRVE";
import SendZPT from "./components/NepTokens/SendZPT";
import SendTNC from "./components/NepTokens/SendTNC";
import SendTKY from "./components/NepTokens/SendTKY";
import SendONT from "./components/NepTokens/SendONT";
import SendPKC from "./components/NepTokens/SendPKC";
import SendRPX from "./components/NepTokens/SendRPX";
import SendWWB from "./components/NepTokens/SendWWB";
import SendXQT from "./components/NepTokens/SendXQT";
import SendDBC from "./components/NepTokens/SendDBC";
import SendGALA from "./components/NepTokens/SendGALA";
import SendQLC from "./components/NepTokens/SendQLC";
import SendTHOR from "./components/NepTokens/SendTHOR";
import SendHP from "./components/NepTokens/SendHP";
import SendBTC from "./components/SendBTC";
import SendLTC from "./components/SendLTC";
import SendETH from "./components/SendETH";
import SendELA from "./components/SendELA";
import SendGAS from "./components/SendGAS";
import AssetPortfolio from "./components/AssetPortfolio";
import NewBitcoin from "./components/NewBitcoin";
import ReceiveBitcoin from "./components/ReceiveBitcoin";
import NewLitecoin from "./components/NewLitecoin";
import ReceiveLitecoin from "./components/ReceiveLitecoin";
import NewEthereum from "./components/NewEthereum";
import NewElastos from "./components/NewElastos";
import ReceiveElastos from "./components/ReceiveElastos";
import ReceiveEthereum from "./components/ReceiveEthereum";
import LedgerDashboard from "./containers/LedgerDashboard";
import LedgerAssetPortfolio from "./components/LedgerAssetPortfolio";
import AdvancedBitcoin from "./components/AdvancedBitcoin";
import SweepBitcoinOther from "./components/SweepBitcoinOther";
import SweepBitcoin from "./components/SweepBitcoin";
import SweepInfo from "./components/SweepInfo";
import AdvancedLitecoin from "./components/AdvancedLitecoin";
import AdvancedEthereum from "./components/AdvancedEthereum";
import AdvancedElastos from "./components/AdvancedElastos";
import DisplayPrivateKeysLTC from "./components/DisplayPrivateKeysLTC";
import DisplayPrivateKeysETH from "./components/DisplayPrivateKeysETH";
import DisplayPrivateKeysELA from "./components/DisplayPrivateKeysELA";
import TokenSale from "./components/TokenSale";
import RemoveAddress from "./components/RemoveAddress";
import AdvancedTokenSale from "./components/AdvancedTokenSale";
import LoadClassicBitcoin from "./components/LoadClassicBitcoin";
import LoadSegwitBitcoin from "./components/LoadSegwitBitcoin";
import LoadOldBitcoin from "./components/LoadOldBitcoin";
import CryptoCity from "./components/CryptoCity";

export default (
	<Route path="/" component={App}>
		<Route path="/dashboard" component={Dashboard}>
			<Route path="/send" component={Send} />
			<Route path="/loopring" component={Loopring} />
			<Route path="/sendRPX" component={SendRPX} />
			<Route path="/sendDBC" component={SendDBC} />
			<Route path="/sendEDS" component={SendEDS} />
			<Route path="/sendGALA" component={SendGALA} />
			<Route path="/sendQLC" component={SendQLC} />
			<Route path="/sendTNC" component={SendTNC} />
			<Route path="/sendTKY" component={SendTKY} />
			<Route path="/sendIAM" component={SendIAM} />
			<Route path="/sendNRVE" component={SendNRVE} />
			<Route path="/sendONT" component={SendONT} />
			<Route path="/sendPKC" component={SendPKC} />
			<Route path="/sendTHOR" component={SendTHOR} />
			<Route path="/sendSWH" component={SendSWH} />
			<Route path="/SendXQT" component={SendXQT} />
			<Route path="/sendZPT" component={SendZPT} />
			<Route path="/sendEFX" component={SendEFX} />
			<Route path="/sendHP" component={SendHP} />
			<Route path="/sendACAT" component={SendACAT} />
			<Route path="/sendAPEX" component={SendAPEX} />
			<Route path="/sendCGE" component={SendCGE} />
			<Route path="/sendGDM" component={SendGDM} />
			<Route path="/sendGAGA" component={SendGAGA} />
			<Route path="/sendLRN" component={SendLRN} />
			<Route path="/sendAPH" component={SendAPH} />
			<Route path="/sendOBT" component={SendOBT} />
			<Route path="/sendWWB" component={SendWWB} />
			<Route path="/sendBTC" component={SendBTC} />
			<Route path="/sendLTC" component={SendLTC} />
			<Route path="/sendETH" component={SendETH} />
			<Route path="/sendELA" component={SendELA}/>
			<Route path="/sendGAS" component={SendGAS}/>
			<Route path="/receive" component={Receive} />
			<Route path="/settings" component={Settings} />
			<Route path="/removeAddress" component={RemoveAddress} />
			<Route path="/selectExchange" component={SelectExchange} />
			<Route path="/changelly" component={Changelly} />
			<Route path="/shapeshift" component={ShapeShift} />
			<Route path="/exchangeAddress" component={ExchangeAddress} />
			<Route path="/ledger" component={Ledger} />
			<Route path="/transactionHistory" component={TransactionHistory} />
			<Route path="/transactionHistoryBTC" component={TransactionHistoryBTC} />
			<Route path="/transactionHistoryLTC" component={TransactionHistoryLTC} />
			<Route path="/transactionHistoryETH" component={TransactionHistoryETH}/>
			<Route path="/transactionHistoryLRC" component={TransactionHistoryLRC}/>
			<Route path="/transactionHistoryEOS" component={TransactionHistoryEOS}/>
			<Route path="/support" component={Support} />
			<Route path="/tokens" component={Tokens} />
			<Route path="/sale" component={Sale} />
			<Route path="/assetPortfolio" component={AssetPortfolio} />
			<Route path="/newBitcoin" component={NewBitcoin} />
			<Route path="/receiveBitcoin" component={ReceiveBitcoin} />
			<Route path="/newLitecoin" component={NewLitecoin} />
			<Route path="/receiveLitecoin" component={ReceiveLitecoin} />
			<Route path="/newEthereum" component={NewEthereum}/>
			<Route path="/newElastos" component={NewElastos}/>
			<Route path="/receiveElastos" component={ReceiveElastos}/>
			<Route path="/receiveEthereum" component={ReceiveEthereum}/>
			<Route path="/advancedBitcoin" component={AdvancedBitcoin}/>
			<Route path="/cryptoCity" component={CryptoCity}/>
			<Route path="/advancedLitecoin" component={AdvancedLitecoin}/>
			<Route path="/advancedEthereum" component={AdvancedEthereum}/>
			<Route path="/advancedElastos" component={AdvancedElastos}/>
			<Route path="/loadOldBitcoin" component={LoadOldBitcoin}/>
			<Route path="/sweepBitcoin" component={SweepBitcoin}/>
			<Route path="/sweepBitcoinOther" component={SweepBitcoinOther}/>
			<Route path="/sweepInfo/:txid" component={SweepInfo}/>
			<Route path="/loadSegwitBitcoin" component={LoadSegwitBitcoin}/>
			<Route path="/loadClassicBitcoin" component={LoadClassicBitcoin}/>
			<Route path="/DisplayPrivateKeysLTC/:history/:ltc_address/:ltcPrivKey"  component={DisplayPrivateKeysLTC}/>
		<Route path="/DisplayPrivateKeysETH/:history/:eth_address/:ethPrivKey"  component={DisplayPrivateKeysETH}/>
		<Route path="/DisplayPrivateKeysELA/:history/:ela_address/:elaPrivKey" component={DisplayPrivateKeysELA}/>
		<Route path="/tokenSale" component={TokenSale} />
		<Route path="/advancedTokenSale" component={AdvancedTokenSale}/>
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
