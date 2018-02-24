import React, { Component } from "react";
import axios from "axios";
import shapeshiftLogo from "../../img/shapeshift.png";
import Exchange_ProgressBar from "./Exchange_ProgressBar";

// declare state without constructor and without linting issues
export default class Exchange_OrderForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedAsset: "select",
			selectedAssetToNeoRate: 0,
			maxLimit: 0,
			minLimit: 0,
			minerFee: 0.001,
			depositAmt: 0
		};
		this.getMarketInfo = this.getMarketInfo.bind(this);
		this.handleSelectAsset = this.handleSelectAsset.bind(this);
		this.handleDepositAmtChange = this.handleDepositAmtChange.bind(this);
		this.calcExpectedNeo = this.calcExpectedNeo.bind(this);
		this.handleOrderClick = this.handleOrderClick.bind(this);
		this.determineNeoOutputAmtValidity = this.determineNeoOutputAmtValidity.bind(this);
	}

	async getMarketInfo(asset) {
		const url = `https://shapeshift.io/marketinfo/${asset}_neo`;
		const response = await axios.get(url);
		const { data } = await response;
		this.setState({
			selectedAssetToNeoRate: data.rate,
			maxLimit: data.maxLimit,
			minLimit: data.minimum,
			minerFee: data.minerFee
		});
	}

	handleSelectAsset(e) {
		const { value } = e.target;
		this.getMarketInfo(value);
		this.setState({ selectedAsset: value });
	}

	handleDepositAmtChange(e) {
		const { value } = e.target;
		this.setState({ depositAmt: value });
	}

	handleOrderClick() {
		const { address } = this.props;
		const { selectedAsset, depositAmt } = this.state;
		const shiftConfig = {
			withdrawal: address,
			pair: `${selectedAsset}_neo`,
			amount: this.calcExpectedNeo(),
			returnAddress: "address_here_based_on_selected_asset"
		};
		this.props.startShiftOrder(shiftConfig);
	}

	calcExpectedNeo() {
		const { depositAmt, selectedAssetToNeoRate } = this.state;
		return depositAmt * selectedAssetToNeoRate;
	}

	determineNeoOutputAmtValidity() {
		const neoOutput = this.calcExpectedNeo();
		return parseInt(neoOutput) === neoOutput ? true : false;
	}


	render() {
		const isValidNeoOutput = this.determineNeoOutputAmtValidity();
		return (

			<div>

				<Exchange_ProgressBar stage={this.props.stage} />

				<div className="top-130 dash-panel">
					<h2 className="center">ShapeShift Exchange Service</h2>
					<hr className="dash-hr-wide" />
					<div className="row top-10">
						<div className="col-xs-4">
							<select
								name="select-profession"
								id="select-profession"
								className=""
								value={this.state.selectedAsset}
								onChange={this.handleSelectAsset}
							>
								<option value="select" disabled={true}>
									Select Asset
								</option>
								<option value="btc">
									Bitcoin (BTC)
								</option>
								<option value="eth">
									Ethereum (ETH)
								</option>
								<option value="ltc">
									Litecoin (LTC)
								</option>
								<option value="xmr">
									Monero (XMR)
								</option>
							</select>
							<p className="sm-text top-10">
								Select Asset to Exchange
							</p>
						</div>

						<div className="col-xs-4">
							<input
								value={this.state.depositAmt}
								onChange={this.handleDepositAmtChange}
								className="form-control-exchange center"
								type="number"
							/>
							<p className="sm-text">Amount to Deposit</p>
						</div>

						<div className="col-xs-4">
							<input
								className="form-control-exchange center"
								value={this.calcExpectedNeo()}
								type="number"
								placeholder="1"
								min={1}
							/>
							{
								isValidNeoOutput
									? <p className="sm-text">Amount of NEO Received</p>
									: <p style={{ color: "red" }}>Sorry, NEO outputs must be whole numbers :(</p>
							}

						</div>
					</div>

					<div className="row">
						<div className="col-xs-8 top-20">
							<input
								className="form-control-exchange center"
								disabled
								placeholder={this.props.address}
							/>
							<p className="sm-text">
								Once complete, NEO will be deposited to the address above
							</p>
						</div>
						<div className="col-xs-4 center top-20">
							{
								isValidNeoOutput
									? (<button onClick={this.handleOrderClick} className="btn-send">Place Order</button>)
									: (<div></div>)
							}
						</div>
					</div>

					<div className="row">
						<div className="col-xs-9 top-20 no-drag">
							<strong>
								Minimum Order: {this.state.minLimit} {this.state.selectedAsset}
							</strong><br />
							<strong>
								Maximum Order: {this.state.maxLimit} {this.state.selectedAsset}
							</strong><br />
							<span className="sm-text">{this.state.minerFee} transaction fees included.</span>
						</div>
						<div className="col-xs-3">
							<img
								src={shapeshiftLogo}
								alt=""
								width="160"
								className="logobounce"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
