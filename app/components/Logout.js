import React from "react";
import { connect } from "react-redux";
import { logout } from "../modules/account";
import { Link } from "react-router";
import Power from "react-icons/lib/md/power-settings-new";
import ReactTooltip from "react-tooltip";

// Logout of address

let Logout = ({ dispatch }) => (
  <div
    id="logout"
    data-tip
    data-for="logoutTip"
    onClick={() => dispatch(logout())}
  >
    <Link to="/">
      <button className="btn">Log Out</button>
    </Link>
    <ReactTooltip
      class="solidTip"
      id="logoutTip"
      place="bottom"
      type="dark"
      effect="solid"
    >
      <span>Exit to login screen</span>
    </ReactTooltip>
  </div>
);

const mapStateToProps = state => ({});

Logout = connect(mapStateToProps)(Logout);

export default Logout;
