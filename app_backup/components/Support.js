import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import gitHub from "../images/github.png";
import disCord from "../images/disCord.png";
import neoNews from "../images/neoNews.png";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";

import { Accordion, AccordionItem } from "react-sanfona";

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Support extends Component {
  componentDidMount = () => {
    syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
  };

  render = () => (
    <div id="send">
<div className="clearboth" />
        <div className="row">
          <div className="col-xs-4 center send-info"
          onClick={() =>
                  openExplorer("https://github.com/MorpheusWallet")
          }
          >
          <img
            src={gitHub}
            alt=""
            width="200"
            className="support-hov"
          />
          </div>
          <div className="col-xs-4 center send-info"
          onClick={() =>
                  openExplorer("https://discord.gg/3eYcq6r")
          }
          >
          <img
            src={disCord}
            alt=""
            width="200"
            className="support-hov"
          />
          </div>
          <div className="col-xs-4 center send-info"
          onClick={() =>
                  openExplorer("http://neonewstoday.com")
          }
          >
          <img
            src={neoNews}
            alt=""
            width="200"
            className="support-hov"
          />
          </div>
          </div>
          <div className="clearboth" />

      <div className="dash-panel fadeInDown">
        <div className="row">
          <div className="col-xs-7 top-10">
          <h2>Frequently Asked Questions</h2>
          </div>

          <div className="col-xs-5 top-10">

          <ul className="social-bar">
          <li> </li>
          <li
          onClick={() =>
                  openExplorer("https://morpheuswallet.com")
          }
          ><span className="glyphicon glyphicon-globe"/> Website</li>
          <li
          onClick={() =>
                  openExplorer("https://twitter.com/morpheuswallet")
          }
          ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
          </ul>
         </div>


          <hr className="dash-hr-wide" />
          <div className="clearboth" />

          <div className="support">

          <Accordion>
                  <AccordionItem titleClassName="accord-title" title="I cannot see my NEP Tokens? Are they still there?" className="col-xs-12">
                  <div className="top-20 accord-body">
                  <strong>Yes.</strong> If you sent NEP tokens to an address created with Morpheus, you can access them via NEON or NeoTracker. You may use your private key and/or encrypted private key and password to login to Morpheus, NEON Wallet or NeoTracker.
                  <br /><br />
                   We are working on NEP token integration. We apologisse for any inconvenience. Follow us on Twitter more inforamation when an update is available.
                  </div>
                   </AccordionItem>
                 <AccordionItem titleClassName="accord-title" title="How do I encrypt my private key?" className="col-xs-12">
                   <div className="top-20 accord-body">
                   <ol>
                   <li>Go to settings</li>
                   <li>Click "Encrypt Private Key"</li>
                   <li>Enter a strong password</li>
                   <li>Confrim your password</li>
                   <li>Enter your private key</li>
                   <li>Click "Generate Encrypted key"</li>
                   <li>Backup your Encrypted Key and Password</li>
                   <li>Save Address to Morpheus</li>
                   </ol>
                   </div>
                 </AccordionItem>
                 <AccordionItem titleClassName="accord-title" title="How do I export my encrypted private key?" className="col-xs-12">
                 <div className="top-20 accord-body">
                 <ol>
                 <li>Go to settings</li>
                 <li>Click "Export Encrypted Key"</li>
                 <li>Save the JSON file</li>
                 </ol>
                 </div>
                 </AccordionItem>
                 <AccordionItem titleClassName="accord-title" title="Can I use my encrypted key/private key to login to other NEO wallets?" className="col-xs-12">
                   <div className="top-20 accord-body">
                    <strong>Yes.</strong> You may use the same private key and/or encrypted key and password to login to NEON, O3 and NeoTracker.
                   </div>
                 </AccordionItem>
                 <AccordionItem titleClassName="accord-title" title="How do I exchange Bitcoin for NEO using Changelly in Morpheus?" className="col-xs-12">
                 <div className="top-20 accord-body">
                 <ol>
                 <li>Select "Exchange" from the side menu</li>
                 <li>Select Changelly</li>
                 <li>Enter the amount in Bitcoin you would like to exchange for NEO</li>
                 <li>Confirm the amount of NEO you will receive</li>
                 <li>Click "Place Order" to generate a unique BTC Segwit deposit address.</li>
                 <li>Deposit BTC to the unique address created for your trasnaction.</li>
                 <li>Once you have sent BTC to the unique BTC address created in Morpheus and you have received at least one confirmation, click "Process Order". If you send less that the agreed amount in BTC you will receive an error and a refund in BTC. If you have any issues, please take note of your transaction ID.</li>
                  <li>Once your BTC deposit has been received, Changelly will send your NEO to your address currently used in Morpheus.</li>
                 </ol>
                 </div>
                 </AccordionItem>

                 <AccordionItem titleClassName="accord-title" title="How do I login to my Ledger Nano S?" className="col-xs-12">
                 <div className="top-20 accord-body">
                 <ol>
                 <li>Plug in your Ledger Nano S</li>
                 <li>Unlock your Ledger</li>
                 <li>Open the NEO app on the Ledger</li>
                 <li>Open Morpheus on your computer</li>
                 <li>From the Morpheus login screen select "Login to Ledger Nano S"</li>
                 <li>Your Ledger Nano S NEO address and balance should be displayed automatically. If you get a warning to connect your device, please exit the NEO app on your Ledger and open the NEO app on the Ledger again.</li>
                 <li>You may now send and receive NEO/GAS directly on your Ledger Nano S.</li>
                 <li>Select "Send" from the side menu to send NEO/GAS</li>
                 <li>To view your transaction history, select "History" from the side menu</li>
                 <li>Select "Retrun" to return to the Morpheus login screen</li>
                 </ol>
                 </div>
                 </AccordionItem>

                 <AccordionItem titleClassName="accord-title" title="How do I deposit NEO/GAS to my Ledger?" className="col-xs-12">
                 <div className="top-20 accord-body">
                 You can login to your Ledger Nano S via Morpheus in two ways.<br /><br />
                   Below we will cover how to deposit NEO/GAS to your Ledger from Morpheus while logged in to another address.
                 <br />
                 <br />
                 <ol>
                 <li>Plug in your Ledger Nano S</li>
                 <li>Unlock your Ledger</li>
                 <li>Open the NEO app on the Ledger</li>
                 <li>Login to Morpheus using an existing private key, encrypted key and password, or by using your password and saved address</li>
                 <li>From the dashboad, click on Ledger in the side menu</li>
                 <li>Your Ledger Nano S should load automatically. If your device does not load, click the reload icon. Please ensure your decide is plugged in, unlocked and the NEO app is open on your Ledger Nano S</li>
                 <li>Once your device has been connected you should see your NEO and GAS balance, NEO public address and the amount to transfer in NEO, GAS and converted in USD.</li>
                 <li>Select the amount you wish to transfer/deposit to your Ledger Nano S. Always test with small amounts to ensure you can access your funds.</li>
                 <li>You can copy your public address to transfer/deposit from direct from an exchange or third party. Always test with small amounts to ensure you can access your funds.</li>
                 <li>Once complete, check your transaction history to ensure the transaction is complete. You may need to refresh the transaction history to get the latest information from the blockchain</li>
                 </ol>
                 <br />

                 Why did we do this?
                 <br /><br />
                 You may choose to use one NEO address as your "hot wallet" for use with exchanges for example, and your Ledger Nano S as your "cold storage". This is an easy way move NEO/GAS from your hot wallet to your cold storage or just access your Ledger NEO address. If you wish to send and recieve directly from your Ledger Nano S, please exit the dashboard and select "Login with Ledger Nano S"
                 </div>
                 </AccordionItem>

           </Accordion>

        </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions,
  explorer: state.metadata.blockExplorer
});

Support = connect(mapStateToProps)(Support);
export default Support;
