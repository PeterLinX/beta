import React, { Component } from "react";
import { connect } from "react-redux";
import { shell } from "electron";
import { setBlockExplorer } from "../modules/metadata";
import { setKeys } from "../modules/account";
import Delete from "react-icons/lib/md/delete";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import rpxLogo from "../img/rpx.png";
import nexLogo from "../img/nex.png";
import qlinkLogo from "../img/qlink.png";
import thekeyLogo from "../img/thekey.png";
import peeratlasLogo from "../img/peeratlas.png";
import ontologyLogo from "../img/ontology.png";
import btcLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import neoLogo from "../img/neo.png";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";
import Claim from "./Claim";
import { NetworkSwitch } from "../components/NetworkSwitch";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import TopBar from "./TopBar";

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Tokens extends Component {
  componentDidMount = () => {
    syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
  };

  render = () => (
    <div id="send">
      <TopBar />
      <div className="settings-panel top-50 fadeInDown">
      <h2 className="center">Asset Manager</h2>
      <hr />
        <div className="tokens-window">
        <div className="col-xs-3  top-20">
        <img
          src={neoLogo}
          alt=""
          width="96"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>NEO & GAS (NEO/GAS)</h3>
        NEO has two native tokens, NEO and NeoGas (abbreviated symbol GAS). The minimum unit of NEO is 1 and tokens cannot be subdivided. The minimum unit of GAS is 0.00000001. All NEO/GAS transactions are free.
        <ul className="social-bar">
        <li
        onClick={() =>
                openExplorer("https://neo.org")
        }
        ><span className="glyphicon glyphicon-globe"/> Website</li>
        <li
        onClick={() =>
                openExplorer("https://github.com/neo-project")
        }
        ><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li
        onClick={() =>
                openExplorer("https://twitter.com/NEO_Blockchain")
        }
        ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20">
        <div className="icon-border"><span className="glyphicon glyphicon-ok" /></div>
        Sccessfully Added
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3  top-20">
        <img
          src={btcLogo}
          alt=""
          width="96"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Bitcoin (BTC)</h3>
        Bitcoin uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of bitcoins is carried out collectively by the network. All BTC transactionsa are subject to network fees.
        <ul className="social-bar">
        <li
        onClick={() =>
                openExplorer("https://bitcoin.org")
        }
        ><span className="glyphicon glyphicon-globe"/> Website</li>
        <li
        onClick={() =>
                openExplorer("https://github.com/bitcoin")
        }
        ><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li
        onClick={() =>
                openExplorer("https://goo.gl/VoEMYf")
        }
        ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
        Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3  top-20">
        <img
          src={rpxLogo}
          alt=""
          width="120"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Red Pulse (RPX)</h3>
        The current Red Pulse platform was launched in 2015 and is already being utilised by leading financial institutions and Fortune 500 corporations.
        <ul className="social-bar">
        <li
        onClick={() =>
                openExplorer("https://coin.red-pulse.com")
        }
        ><span className="glyphicon glyphicon-globe"/> Website</li>
        <li
        onClick={() =>
                openExplorer("https://coin.red-pulse.com/wp-content/uploads/redpulse-whitepaper-en.pdf")
        }
        ><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li
        onClick={() =>
                openExplorer("https://twitter.com/RedPulseNEO")
        }
        ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3 top-20">
        <img
          src={nexLogo}
          alt=""
          width="120"
          className="tokens top-10"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>NEX Exchange (NEX)</h3>
        NEX is a platform for complex decentralized cryptographic trade and payment service creation. NEX combines the NEO blockchain with an off-chain matching engine to enable much faster and more complex trades than existing decentralized exchanges.
        <ul className="social-bar">
        <li
        onClick={() =>
                openExplorer("https://neonexchange.org")
        }
        ><span className="glyphicon glyphicon-globe"/> Website</li>
        <li
        onClick={() =>
                openExplorer("https://github.com/CityOfZion")
        }
        ><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
        <li
        onClick={() =>
                openExplorer("https://www.twitter.com/neonexchange")
        }
        ><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
        </ul>
        </div>
        <div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
        <div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
        </div>
        <div className="clearboth" />

        <div className="row top-30"/>
        <div className="col-xs-3 ">
        <img
          src={qlinkLogo}
          alt=""
          width="120"
          className="tokens"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>QLink (QLK)</h3>
        Qlink, a decentralized mobile network, is dedicated to constructing an open-source telecom infrastructure on blockchain.
<ul className="social-bar">
<li
onClick={() =>
        openExplorer("https://qlink.mobi/f/qlink")
}
><span className="glyphicon glyphicon-globe"/> Website</li>
<li
onClick={() =>
        openExplorer("https://github.com/qlinkDev")
}
><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li
onClick={() =>
        openExplorer("https://twitter.com/QlinkMobi")
}
><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={thekeyLogo}
          alt=""
          width="120"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>TheKEY (TKY)</h3>
THEKEY Project Team is now developing an identification verification (IDV) tool with blockchain based dynamic multi-dimension identification (BDMI) by using Personally Identifiable Information (PII) which is exclusively authorized by government authorities.
<ul className="social-bar">
<li
onClick={() =>
        openExplorer("https://www.thekey.vip")
}
><span className="glyphicon glyphicon-globe"/> Website</li>
<li
onClick={() =>
        openExplorer("https://github.com/thekeygithub/THEKEY")
}
><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li
onClick={() =>
        openExplorer("https://twitter.com/thekeyvip")
}
><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={peeratlasLogo}
          alt=""
          width="105"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>PeerAtlas (ATLAS)</h3>
The ATLAS token represents the permanent destruction of the world’s most unethical paywall: cutting-edge medical knowledge has been separated by money from its physicians and the general public.
<ul className="social-bar">
<li
onClick={() =>
        openExplorer("http://www.peeratlas.com")
}
><span className="glyphicon glyphicon-globe"/> Website</li>
<li
onClick={() =>
        openExplorer("http://whitepaper.peeratlas.com")
}
><img src={gitsmLogo} alt="" width="16" className="" /> Website</li>
<li
onClick={() =>
        openExplorer("https://twitter.com/PeerAtlas")
}
><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>
<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={ontologyLogo}
          alt=""
          width="120"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Ontology (ONT)</h3>
        Ontology Network is a blockchain/distributed ledger network which combines distributed identity verification, data exchange, data collaboration, procedure protocols, communities, attestation, and various industry-specific modules. Together this builds the infrastructure for a peer-to-peer trust network which is cross-chain, cross-system, cross-industry, cross-application, and cross-device.
<ul className="social-bar">
<li
onClick={() =>
        openExplorer("https://ont.io")
}
><span className="glyphicon glyphicon-globe"/> Website</li>
<li
onClick={() =>
        openExplorer("https://ont.io/static/wp/Ontology%20Introductory%20White%20Paper.pdf")
}
><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li
onClick={() =>
        openExplorer("https://twitter.com/OntologyNetwork")
}
><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>

<div className="clearboth" />

<div className="row top-30"/>
        <div className="col-xs-3">
        <img
          src={ltcLogo}
          alt=""
          width="96"
          className="tokens top-20"
        />
        </div>
        <div className="col-xs-7 ">
        <h3>Litecoin (LTC)</h3>
        Litecoin is a peer-to-peer Internet currency that enables instant, near-zero cost payments to anyone in the world. Litecoin is an open source, global payment network that is fully decentralized without any central authorities. Mathematics secures the network and empowers individuals to control their own finances.
<ul className="social-bar">
<li
onClick={() =>
        openExplorer("https://litecoin.org")
}
><span className="glyphicon glyphicon-globe"/> Website</li>
<li
onClick={() =>
        openExplorer("https://github.com/litecoin-project/litecoin")
}
><img src={gitsmLogo} alt="" width="16" className="" /> Githib</li>
<li
onClick={() =>
        openExplorer("https://twitter.com/LitecoinProject")
}
><img src={twitsmLogo} alt="" width="16" className="" /> Twitter</li>
</ul>
</div>
<div className="col-xs-2 center add-token top-20 token-soon"
data-tip
data-for="tokenTip"
>
<div className="icon-border"><span className="glyphicon glyphicon-plus" /></div>
Add Address
</div>


<ReactTooltip
  className="solidTip"
  id="tokenTip"
  place="top"
  type="light"
  effect="solid"
>
  <span>Coming Soon</span>
</ReactTooltip>
        <div className="clearboth"/>
        <div className="row top-20" />
        </div>
      </div>

      <div className="clearboth" />
    </div>
  );
}

const mapStateToProps = state => ({
  explorer: state.metadata.blockExplorer,
  wallets: state.account.accountKeys,
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions
});

Tokens = connect(mapStateToProps)(Tokens);

export default Tokens;
