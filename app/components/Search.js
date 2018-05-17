import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router";

class Search extends Component {
	constructor() {
    super();

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {

    if (!this.dropdownMenu.contains(event.target)) {

      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });

    }
  }

	render() {
		return (


			<div>
			        <button className="dropMenuButton" onClick={this.showMenu}>
			          Quick Menu <span className="caret"></span>
			        </button>

			        {
			          this.state.showMenu
			            ? (
			              <div
       className="dropMenu"
       ref={(element) => {
         this.dropdownMenu = element;
       }}
			              >
       <ul className="dropMenuList">
       <Link to="/sendACAT">
			 <li>AlphaCat</li>
			 </Link>
       <Link to="/sendApex"><li>Apex</li></Link>
       <Link to="/sendAPH"><li>Aphelion</li></Link>
       <Link to="/SendBTC"><li>Bitcoin</li></Link>
       <Link to="/sendIAM"><li>Bridge</li></Link>
       <Link to="/sendDBC"><li>DeepBrain</li></Link>
       <Link to="/sendEFX"><li>Effect</li></Link>
       <Link to="/sendEDS"><li>Endorsit</li></Link>
       <Link to="/SendETH"><li>Ethereum</li></Link>
       <Link to="/sendGAGA"><li>GagaPay</li></Link>
       <Link to="/sendGALA"><li>Galaxy</li></Link>
       <Link to="/send"><li>Gas</li></Link>
       <Link to="/sendGDM"><li>Guardium</li></Link>
       <Link to="/sendHP"><li>Hashpuppies</li></Link>
       <Link to="/SendLTC"><li>Litecoin</li></Link>
       <Link to="/sendLRN"><li>Loopring</li></Link>
			 <Link to="/sendMCT"><li>Master Contract</li></Link>
       <Link to="/sendNRVE"><li>Narrative</li></Link>
       <Link to="/send"><li>NEO</li></Link>
       <Link to="/sendOBT"><li>Orbis</li></Link>
       <Link to="/sendONT"><li>Ontology</li></Link>
       <Link to="/sendPKC"><li>Pikcio</li></Link>
       <Link to="/sendQLC"><li>Qlink</li></Link>
       <Link to="/sendXQT"><li>Quarteria</li></Link>
       <Link to="/sendRPX"><li>RedPulse</li></Link>
       <Link to="/sendSWH"><li>Switcheo</li></Link>
       <Link to="/sendTHOR"><li>Thor</li></Link>
       <Link to="/sendTKY"><li>TheKey</li></Link>
       <Link to="/sendTNC"><li>Trinity</li></Link>
			 <Link to="/sendCGE"><li>Travala</li></Link>
       <Link to="/sendWWB"><li>WoWoo</li></Link>
       <Link to="/sendZPT"><li>Zeepin</li></Link>
       </ul>
			              </div>
			            )
			            : (
			              null
			            )
			        }
			      </div>

		);
	}
}

const mapStateToProps = state => ({
});

Search = connect(mapStateToProps)(Search);
export default Search;
