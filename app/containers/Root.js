import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Router } from "react-router";
import routes from "../routes";
import background from "../img/background_logins.png";

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <div className="container-fluid">
          <Router history={history} routes={routes} />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
