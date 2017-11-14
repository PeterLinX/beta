import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import Modal from "react-modal";
import Spinner from "react-spinkit";

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "none"
  },
  content: {
    margin: "50px auto 0",
    padding: "30px 30px 30px 30px",
    border: "thick solid #222",
    background: "rgba(12, 12, 14, 1)",
    borderRadius: "20px",
    top: "100px",
    height: 261,
    width: 559,
    left: "100px",
    right: "100px",
    bottom: "100px",
    boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
  }
};

const StatusMessage = ({ status, statusMessage }) => {
  let message = null;
  if (status === true) {
    message = (
      <Modal
        isOpen={true}
        closeTimeoutMS={200}
        style={customStyles}
        contentLabel="Modal"
      >
        <div>
          <div className="center">
            <p>{statusMessage}</p>
          </div>

          <div className="center ">
            <Spinner name="line-spin-fade-loader" color="orange" />
          </div>
        </div>
      </Modal>
    );
  } else if (status === false) {
    message = (
      <Modal
        isOpen={true}
        closeTimeoutMS={200}
        style={customStyles}
        contentLabel="Modal"
      >
        <div>
          <div className="center">
            <p>{statusMessage}</p>
          </div>
        </div>
      </Modal>
    );
  }
  return message;
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };

    this.closeModal = this.closeModal.bind(this);
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  render() {
    return (
      <div id="pageWrapper">
        <StatusMessage
          status={this.props.status}
          statusMessage={this.props.statusMessage}
        />
        <div>{this.props.children}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.transactions.success,
  statusMessage: state.transactions.message
});

App = connect(mapStateToProps)(App);

export default App;
