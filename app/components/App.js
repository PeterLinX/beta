import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import Modal from "react-modal";
import spinner from "../img/spinner.png";

// Modal Windows
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    },
    content: {
        margin: "100px auto 0",
        padding: "30px 30px 30px 30px",
        border: "4px solid #222",
        background: "rgba(12, 12, 14, 1)",
        borderRadius: "20px",
        top: "100px",
        height: 260,
        width: 600,
        left: "100px",
        right: "100px",
        bottom: "100px",
        boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
    }
};


// Modal Status
const StatusMessage = ({ statusMessage, onConfirm, onCancel }) => {
    let message = null;

    message = (
		<Modal
			isOpen={true}
			closeTimeoutMS={5}
			style={styles}
			contentLabel="Modal"
			ariaHideApp={false}
		>
			<div>
				<div className="center modal-alert">
					<div id="preloader">
						<div id="loader"></div>
						<audio src="../audio/notification.mp3" autoPlay></audio>
					</div>
				</div>
				<div className="center modal-alert">
                    {statusMessage}
				</div>

				<div className="center modal-alert">
					<button onClick={onCancel} className="cancel_button">
						Cancel
					</button>
					<button onClick= {onConfirm} className="confirm_button">
						Confirm
					</button>
				</div>
			</div>
		</Modal>
    );

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

export {
    App,
	StatusMessage
};