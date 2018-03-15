import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import gitHub from "../images/github.png";
import disCord from "../images/discord.png";
import neoNews from "../images/neonews.png";
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

                 <h3>Withdrawing/Sending from Ledger Nano S is currently dissabled</h3>

                 <strong>We have recently added over a dozen new tokens and other cryptocurrencies, a release will be coming soon that will allow sending/withdrawals from your Ledger Nano S. We apologize for any inconvenince.</strong>


                 <ol>
                 <li>Please note withdrawals/sending from Ledger Nano S is disabled in this release.</li>
                 <li>Plug in your Ledger Nano S</li>
                 <li>Unlock your Ledger</li>
                 <li>Open the NEO app on the Ledger</li>
                 <li>Open Morpheus on your computer</li>
                 <li>From the Morpheus login screen select "Login to Ledger Nano S"</li>
                 <li>Your Ledger Nano S NEO address and balance should be displayed automatically. If you get a warning to connect your device, please exit the NEO app on your Ledger and open the NEO app on the Ledger again.</li>
                 <li>To view your transaction history, select "History" from the side menu</li>
                 <li>Select "Retrun" to return to the Morpheus login screen</li>
                 </ol>


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
