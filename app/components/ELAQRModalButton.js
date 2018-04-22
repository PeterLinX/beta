import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router";
import Modal from "react-modal";
import ReceiveELA from "./ReceiveElastos.js";

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
        padding: "20px",
        border: "4px solid #222",
        background: "rgba(12, 12, 14, 1)",
        borderRadius: "20px",
        top: "80px",
        height: 480,
        width: 420,
        left: "180px",
        right: "0px",
        bottom: "100px",
        boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
    }
};

const StatusMessage = ({
  handleCancel
 }) => {
    let message = (
        <Modal
            isOpen={true}
            closeTimeoutMS={5}
            style={styles}
            contentLabel="Modal"
            ariaHideApp={false}
        >
          <div>
            <div className="center modal-alert">
            </div>
            <div className="center modal-alert top-20">
						<ReceiveELA />
            </div>
          <button className="close-button" onClick={handleCancel}>X</button>
          </div>
        </Modal>
    );
    return message;
};

class portACAT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			acatPrice: 0,
		};

	}

	render() {
		return (

			<div>
			{
					this.state.modalStatus?
							<StatusMessage
							handleCancel = {
									() => {
											this.setState({
													modalStatus: false
											})
									}
							}
							/>
							:
							null
			}
      <Link>
        <div className="grey-button com-soon"
        onClick={() => {
          this.setState({
            modalStatus: true
          })
        }}
        >
        <span className="glyphicon glyphicon-qrcode marg-right-5"/> Receive</div>
      </Link>
			</div>

		);
	}
}

const mapStateToProps = state => ({
	acat: state.wallet.Acat,
	marketACATPrice: state.wallet.marketACATPrice
});

portACAT = connect(mapStateToProps)(portACAT);
export default portACAT;
