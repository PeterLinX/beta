import React, { Component } from "react";
import axios from "axios";
import shapeshiftLogo from "../../img/shapeshift.png";
import Exchange_ProgressBar from "./Exchange_ProgressBar";

let depositAsset,withdrawalAsset;
// declare state without constructor and without linting issues
export default class Exchange_OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositAsset: "select",
            withdrawalAsset: "select",
            depositTowithdrawRate: 0,
            maxLimit: 0,
            minLimit: 0,
            minerFee: 0.001,
            depositAmt: 0
        };
        this.getMarketInfo = this.getMarketInfo.bind(this);
        this.handleSelectDepositAsset = this.handleSelectDepositAsset.bind(this);
        this.handleSelectWithdrawalAsset = this.handleSelectWithdrawalAsset(this);
        this.handleDepositAmtChange = this.handleDepositAmtChange.bind(this);
        this.calcExpectedWithdrawal = this.calcExpectedWithdrawal.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.determineWithdrawOutputAmtValidity = this.determineWithdrawOutputAmtValidity.bind(this);
    }

    async getMarketInfo(deposit_asset, withdraw_asset) {
        const url = `https://shapeshift.io/marketinfo/${deposit_asset}_${withdraw_asset}`;
        const response = await axios.get(url);
        const { data } = await response;
        console.log("response data = " + JSON.stringify(data));
        this.setState({
            depositTowithdrawRate: data.rate,
            maxLimit: data.maxLimit,
            minLimit: data.minimum,
            minerFee: data.minerFee
        });
    }

    handleSelectDepositAsset(e) {
        const { value } = e.target;
        console.log("deposit asset value = " + value)
        //this.getMarketInfo(value);
        this.setState({ depositAsset: value });
    }

    handleSelectWithdrawalAsset(e) {
        const { value } = e.target
        console.log("withdrawal asset value = " + value)
        this.setState({ withdrawalAsset: value });
    }

    handleDepositAmtChange(e) {
        const { value } = e.target;
        if (depositAsset.value === "select" || withdrawalAsset.value === "select" ) {
            console.log("Please select valid asset.");
            return false;
        }
        this.getMarketInfo(depositAsset.value, withdrawalAsset.value)
        let real_value = parseFloat(value);
        this.setState({ depositAmt: real_value });
    }

    handleOrderClick() {
        let shiftAddress;
        const { address, btcPubAddr, ltcPubAddr, ethPubAddr } = this.props;
        const { depositAsset, withdrawalAsset, depositAmt } = this.state;

        if (withdrawalAsset === "neo") {
            shiftAddress = address;
        } else if (withdrawalAsset === "btc") {
            btcPubAddr === null? console.log("please login bitcoin") : shiftAddress = btcPubAddr;
        } else if (withdrawalAsset === "eth") {
            ethPubAddr === null? console.log("please login ethereum") : shiftAddress = ethPubAddr;
        } else if (withdrawalAsset === "ltc") {
            ltcPubAddr === null? console.log("please login litecoin") : shiftAddress = ltcPubAddr;
        } else {
            console.log("asset error");
            return false;
        }

        console.log("depositAsset = " + depositAsset);
        console.log("withdrawalAsset = " + withdrawalAsset);
        console.log("shapeshift address = " + shiftAddress);
        console.log("calcExpectedWithdrawal = " + this.calcExpectedWithdrawal());

        const shiftConfig = {
            withdrawal: shiftAddress,
            pair: `${depositAsset}_${withdrawalAsset}`,
            amount: this.calcExpectedWithdrawal(),
            returnAddress: "address_here_based_on_selected_asset"
        };
        console.log("calling startShiftOrder");
        this.props.startShiftOrder(shiftConfig);
        console.log("called startShiftOrder");
    }

    calcExpectedWithdrawal() {
        const { depositAmt, depositTowithdrawRate } = this.state;
        console.log("deposit amount = " + depositAmt);
        console.log("depositTowithdrawRate = " + depositTowithdrawRate);
        console.log("withdrawal amount = " + depositAmt * depositTowithdrawRate);
        return depositAmt * depositTowithdrawRate;
    }

    determineWithdrawOutputAmtValidity() {
        const withdrawalOutput = this.calcExpectedWithdrawal();

        if (this.state.withdrawalAsset === "neo") {
            return parseInt(withdrawalOutput) === withdrawalOutput ? true : false;
        }

        return true;
    }


    render() {
        const isValidWithdrawalOutput = this.determineWithdrawOutputAmtValidity();
        return (

			<div>

				<Exchange_ProgressBar stage={this.props.stage} />

				<div className="top-130 dash-panel">
					<h2 className="center">ShapeShift Exchange Service</h2>
					<hr className="dash-hr-wide" />
					<div className="row top-10">
						<div className="col-xs-3">
							<select
								name="select-profession"
								id="select-profession"
								className=""
								ref={node => (depositAsset = node)}
								value={this.state.depositAsset}
								onChange={this.handleSelectDepositAsset}
							>
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
								Select Asset to deposite
							</p>
						</div>

						<div className="col-xs-3">
							<select
								name="select-profession-to"
								id="select-profession-to"
								className=""
								ref={node => (withdrawalAsset = node)}
								value={this.state.withdrawalAsset}
								onChange={this.handleSelectWithdrawalAsset}
							>
								<option value="btc">
									Bitcoin (BTC)
								</option>
								<option value="eth">
									Ethereum (ETH)
								</option>
								<option value="ltc">
									Litecoin (LTC)
								</option>
							</select>
							<p className="sm-text top-10">
								Select Asset to withdraw
							</p>
						</div>

						<div className="col-xs-3">
							<input
								value={this.state.depositAmt}
								onChange={this.handleDepositAmtChange}
								className="form-control-exchange center"
								type="number"
							/>
							<p className="sm-text">Amount to Deposit</p>
						</div>

						<div className="col-xs-3">
							<input
								className="form-control-exchange center"
								value={this.calcExpectedWithdrawal()}
								type="number"
								placeholder="1"
								min={1}
							/>
                            {
                                isValidWithdrawalOutput
                                    ? <p className="sm-text">Amount of Withdrawal Received</p>
                                    : <p style={{ color: "red" }}>Sorry, Withdraw currency outputs must be whole numbers :(</p>
                            }

						</div>
					</div>

					<div className="row">
						<div className="col-xs-8 top-20">
							<input
								className="form-control-exchange center"
								disabled
								placeholder={
                                    {
                                        neo: this.props.address,
                                        btc: this.props.btcPubAddr,
                                        ltc: this.props.ltcPubAddr,
                                        eth: this.props.ethPubAddr
                                    }[this.state.withdrawalAsset]
                                }
							/>
							<p className="sm-text">
								Once complete, NEO will be deposited to the address above
							</p>
						</div>
						<div className="col-xs-4 center top-20">
                            {
                                isValidWithdrawalOutput
                                    ? (<button onClick={this.handleOrderClick} className="btn-send">Place Order</button>)
                                    : (<div></div>)
                            }
						</div>
					</div>

					<div className="row">
						<div className="col-xs-9 top-20 no-drag">
							<strong>
								Minimum Order: {this.state.minLimit} {this.state.depositAsset}
							</strong><br />
							<strong>
								Maximum Order: {this.state.maxLimit} {this.state.depositAsset}
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
