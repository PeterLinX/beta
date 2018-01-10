import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { shell } from "electron";
import axios from "axios";
import _ from "lodash";
import moment from "moment";

import changellyLogo from "../img/changelly.png";
import shapeshiftLogo from "../img/shapeshift.png";
import TopBar from "./TopBar";
import Assets from "./Assets";
import Affiliate from "./Affiliate";

class SelectExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: 0,
    };
  }

  render() {
    return (
      <div>

          <div className="row top-20">
          <Link to="/exchange">
            <div className="col-2 center">
            <img
              src={changellyLogo}
              alt=""
              width="240"
              className="logobounce"
            />
            <hr className="dash-hr" />
            <span className="top-20">"Exchange cryptocurrency at the best rate. Transfer from one wallet to another within seconds. It is that simple."</span>
            </div>
            </Link>
            <div className="col-2 center com-soon">
            <img
              src={shapeshiftLogo}
              alt=""
              width="240"
              className="logobounce com-soon"
            />
            <hr className="dash-hr" />
            <span className="top-20">"The Safest, Fastest Asset Exchange on Earth. Trade any leading blockchain asset for any other. Protection by Design..."
            </span>
            </div>

        </div>
        <Affiliate />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price
});

SelectExchange = connect(mapStateToProps)(SelectExchange);

export default SelectExchange;
