import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import Modal from "react-modal";

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
    width: "720px",
    padding: "30px 30px 30px 30px",
    border: "thick solid #222",
    background: "rgba(12, 12, 14, 0.85)",
    borderRadius: "20px",
    boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
  }
};

const StatusMessage = ({ status, statusMessage }) => {
  let message = null;
  if (status === true) {
    console.log(statusMessage);
    message = (
      <Modal
        isOpen={true}
        closeTimeoutMS={6000000}
        style={customStyles}
        contentLabel="Modal"
      >
        <h1>{statusMessage}</h1>
      </Modal>
    );
  } else if (status === false) {
    console.log(statusMessage);
    message = (
      <Modal
        isOpen={true}
        closeTimeoutMS={6000000}
        style={customStyles}
        contentLabel="Modal"
      >
        <h1>{statusMessage}</h1>
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
