import React, { Component } from "react";
import { connect } from "react-redux";

import Exchange_Unavailable from "../Exchange_Components/Exchange_Unavailable";
import Exchange_OrderForm from "../Exchange_Components/Exchange_OrderForm";
import Exchange_OrderLoading from "../Exchange_Components/Exchange_OrderLoading";
import Exchange_Deposit from "../Exchange_Components/Exchange_Deposit";
import Exchange_Processing from "../Exchange_Components/Exchange_Processing";
import Exchange_Complete from "../Exchange_Components/Exchange_Complete";

import { sendEvent, clearTransactionEvent } from "../../modules/transactions";
import { startShiftOrder, fetchDepositStatus, resetOrderState } from "../../modules/shapeshift";

class ShapeShift extends Component {
	constructor(props) {
		super(props);
		this.pollForDepositStatusConditionallyEvery = this.pollForDepositStatusConditionallyEvery.bind(this);
	}
	componentDidMount() {
		this.pollForDepositStatusConditionallyEvery(5000);
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
		const { available, stage, txData, completeData, resetOrderState } = this.props;
		if (!stage) return <Exchange_OrderForm {...this.props} />;
		else if (stage === "ordering") return <Exchange_OrderLoading stage={stage} exchangeName={"ShapeShift"}/>;
		else if (stage === "depositing") return <Exchange_Deposit stage={stage} txData={txData} exchangeName={"shapeshift"}/>;
		else if (stage === "processing") return <Exchange_Processing stage={stage} txData={txData}/>;
		else if (stage === "complete") return <Exchange_Complete stage={stage} completeData={completeData} resetOrderState={resetOrderState}/>;
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
	startShiftOrder,
	fetchDepositStatus,
	resetOrderState,
	sendEvent
});

ShapeShift = connect(mapStateToProps, mapDispatchToProps)(ShapeShift);

export default ShapeShift;
