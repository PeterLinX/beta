import React from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";

// import { Link } from 'react-router';

const Modal = props => {
  return (
    <div
      className="modal fade"
      style={{ zIndex: 10 }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">error: {props.error}</h4>
          </div>
          <div className="modal-body">{props.statusMessage}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusMessage = ({ status, statusMessage }) => {
  let message = null;
  if (status === true) {
    console.log(statusMessage);
    // message = <div className="statusMessage success">{statusMessage}</div>;
  } else if (status === false) {
    console.log(statusMessage);
    // message = <div className="statusMessage fail">{statusMessage}</div>;
  }
  return message;
};

let App = ({ children, status, statusMessage }) => {
  let statusPaneSize;
  if (status !== null) {
    statusPaneSize = "30px";
  } else {
    statusPaneSize = "0px";
  }
  return (
    <div id="pageWrapper">
      <div>{children}</div>
      <StatusMessage status={status} statusMessage={statusMessage} />
    </div>
  );
};

const mapStateToProps = state => ({
  status: state.transactions.success,
  statusMessage: state.transactions.message
});

App = connect(mapStateToProps)(App);

export default App;
