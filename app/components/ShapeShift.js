import React, { Component } from "react";
import { connect } from "react-redux";

import UnavailableExchange from "../components/UnavailableExchange";
import Exchange_OrderForm from "../components/Exchange_OrderForm";
import Exchange_OrderLoading from "../components/Exchange_OrderLoading";
import Exchange_Deposit from "../components/Exchange_Deposit";
import Exchange_Processing from "../components/Exchange_Processing";
import Exchange_Complete from "../components/Exchange_Complete";

import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { fetchNeoStatus, startShiftOrder, fetchDepositStatus, resetOrderState } from "../modules/shapeshift";

class ShapeShift extends Component {
	constructor(props) {
		super(props);
		this.pollForNeoConditonallyEvery = this.pollForNeoConditonallyEvery.bind(this);
		this.pollForDepositStatusConditionallyEvery = this.pollForDepositStatusConditionallyEvery.bind(this);
	}
	componentDidMount() {
		this.pollForNeoConditonallyEvery(30000);
		this.pollForDepositStatusConditionallyEvery(5000);
	}
	pollForNeoConditonallyEvery(ms) {
		let { available, stage, fetchNeoStatus, address } = this.props;
		if (!available && !stage) fetchNeoStatus(address);
		setInterval(() => {
			// Get the latest stage. If in the middle of the stage, it should not poll for NEO availability
			let { stage, fetchNeoStatus, address } = this.props;
			!stage && fetchNeoStatus(address);
		}, ms);
	}
	pollForDepositStatusConditionallyEvery(ms) {
		const { fetchDepositStatus, stage, txData } = this.props;
		if (stage === "depositing" || stage === "processing") fetchDepositStatus(txData.deposit);
		setInterval(() => {
			const { fetchDepositStatus, stage, txData } = this.props;
			if (stage === "depositing" || stage === "processing") fetchDepositStatus(txData.deposit);
		}, ms);
	}

	render() {
		const { available, fetching, stage, txData, completeData } = this.props;
		if (!available && !fetching && !stage) return <UnavailableExchange exchangeName={"ShapeShift"}/>;
		else if (!stage) return <Exchange_OrderForm {...this.props} />;
		else if (stage === "ordering") return <Exchange_OrderLoading exchangeName={"ShapeShift"}/>;
		else if (stage === "depositing") return <Exchange_Deposit txData={txData} exchangeName={"shapeshift"}/>;
		else if (stage === "processing") return <Exchange_Processing txData={txData}/>;
		else if (stage === "complete") return <Exchange_Complete completeData={completeData}/>;
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	rpx: state.wallet.Rpx,
	dbc: state.wallet.Dbc,
	qlc: state.wallet.Qlc,
	Rhpt: state.wallet.Rhpt,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	fetching: state.shapeshift.fetching,
	available: state.shapeshift.available,
	stage: state.shapeshift.stage, // possible states - null, ordering, depositing, processing, complete
	txData: state.shapeshift.txData,
	completeData: state.shapeshift.completeData,
	error: state.shapeshift.error
});

const mapDispatchToProps = ({
	fetchNeoStatus,
	startShiftOrder,
	fetchDepositStatus,
	resetOrderState,
	sendEvent
});

ShapeShift = connect(mapStateToProps, mapDispatchToProps)(ShapeShift);

export default ShapeShift;
