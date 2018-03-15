import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import neoLogo from "../images/neo.png";
import { Link } from "react-router";
import Assets from "./Assets";

// CryptoCompare API for ChartJS
const api = val => {
	return `https://min-api.cryptocompare.com/data/histohour?fsym=${
		val
	}&tsym=USD&limit=72&aggregate=3&e=CCCAGG`;
};

class Charts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			neoData: [],
			gasData: [],
			btcData: [],
			dbcData: [],
			qlcData: [],
			rpxData: [],
			tncData: [],
			zptData: [],
			open: "--",
			high: "--",
			low: "--"
		};
	}

	async componentDidMount() {
		await this.getGasData();
		await this.getNeoData();
		await this.getBtcData();
		await this.getDbcData();
		await this.getQlcData();
		await this.getRpxData();
		await this.getTncData();
		await this.getZptData();
	}

	async getGasData() {
		try {
			let req = await axios.get(api("GAS"));
			let data = req.data.Data;
			this.setState({ gasData: data });
		} catch (error) {
			console.log(error);
		}
	}
	// NEO
	async getNeoData() {
		try {
			let req = await axios.get(api("NEO"));
			let data = req.data.Data;
			this.setState({ neoData: data });
			this.setState({ ...data[95] });
		} catch (error) {
			console.log(error);
		}
	}
	// BTC
	async getBtcData() {
		try {
			let req = await axios.get(api("BTC"));
			let data = req.data.Data;
			this.setState({ btcData: data });
		} catch (error) {
			console.log(error);
		}
	}
	// LTC
	async getDbcData() {
		try {
			let req = await axios.get(api("DBC"));
			let data = req.data.Data;
			this.setState({ dbcData: data });
		} catch (error) {
			console.log(error);
		}
	}
	// ETH
	async getQlcData() {
		try {
			let req = await axios.get(api("QLC"));
			let data = req.data.Data;
			this.setState({ qlcData: data });
		} catch (error) {
			console.log(error);
		}
	}

	// RPX
	async getRpxData() {
		try {
			let req = await axios.get(api("RPX"));
			let data = req.data.Data;
			this.setState({ rpxData: data });
		} catch (error) {
			console.log(error);
		}
	}

	// TNC
	async getTncData() {
		try {
			let req = await axios.get(api("TNC"));
			let data = req.data.Data;
			this.setState({ tncData: data });
		} catch (error) {
			console.log(error);
		}
	}

	// ZPT
	async getZptData() {
		try {
			let req = await axios.get(api("ZPT"));
			let data = req.data.Data;
			this.setState({ zptData: data });
		} catch (error) {
			console.log(error);
		}
	}
	// Chart Data
	render() {
		const neoPrices = _.map(this.state.neoData, "close");
		const neoHours = _.map(this.state.neoData, "time");

		const convertedTime = neoHours.map(val => moment.unix(val).format("LLL"));

		const dbcPrices = _.map(this.state.dbcData, "close");
		const btcPrices = _.map(this.state.btcData, "close");
		const qlcPrices = _.map(this.state.qlcData, "close");
		const rpxPrices = _.map(this.state.rpxData, "close");
		const tncPrices = _.map(this.state.tncData, "close");
		const zptPrices = _.map(this.state.zptData, "close");
		const gasPrices = _.map(this.state.gasData, "close");
		// Chart Styling
		const data = canvas => {
			let ctx = canvas.getContext("2d");
			let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, "#7ED321");
			gradientStroke.addColorStop(1, "#7ED321");

			let gradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			gradientFill.addColorStop(0, "rgba(68,147,33,0.8)");
			gradientFill.addColorStop(1, "rgba(68,147,33,0)");
			const gradient = ctx.createLinearGradient(0, 0, 100, 0);

			let gasGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gasGradientStroke.addColorStop(0, "#9013FE");
			gasGradientStroke.addColorStop(1, "#9013FE");

			let gasGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			gasGradientFill.addColorStop(0, "rgba(144,147,254, 1)");
			gasGradientFill.addColorStop(1, "rgba(144,147,254, 0)");

			let dbcGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			dbcGradientStroke.addColorStop(0, "#5ac1d4");
			dbcGradientStroke.addColorStop(1, "#5ac1d4");

			let dbcGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			dbcGradientFill.addColorStop(0, "rgba(90,193,212, 0.5)");
			dbcGradientFill.addColorStop(1, "rgba(90,193,212, 0)");

			let btcGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			btcGradientStroke.addColorStop(0, "#ffc000");
			btcGradientStroke.addColorStop(1, "#ffc000");

			let btcGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			btcGradientFill.addColorStop(0, "rgba(229,172,0, 0.5)");
			btcGradientFill.addColorStop(1, "rgba(229,172,0, 0)");

			let qlcGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			qlcGradientStroke.addColorStop(0, "#ae00d6");
			qlcGradientStroke.addColorStop(1, "#ae00d6");

			let qlcGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			qlcGradientFill.addColorStop(0, "rgba(175,0,214, 0.5)");
			qlcGradientFill.addColorStop(1, "rgba(175,0,214, 0)");

			let rpxGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			rpxGradientStroke.addColorStop(0, "#C60307");
			rpxGradientStroke.addColorStop(1, "#C60307");

			let rpxGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			rpxGradientFill.addColorStop(0, "rgba(169,3,41, 0.5)");
			rpxGradientFill.addColorStop(1, "rgba(169,3,41, 0)");

			let tncGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			tncGradientStroke.addColorStop(0, "#fd489b");
			tncGradientStroke.addColorStop(1, "#fd489b");

			let tncGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			tncGradientFill.addColorStop(0, "rgba(217,64,134, 0.5)");
			tncGradientFill.addColorStop(1, "rgba(217,64,134, 0)");

			let zptGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			zptGradientStroke.addColorStop(0, "#7bc500");
			zptGradientStroke.addColorStop(1, "#7bc500");

			let zptGradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			zptGradientFill.addColorStop(0, "rgba(159,255,0, 0.5)");
			zptGradientFill.addColorStop(1, "rgba(159,255,0, 0)");

			// Chart Content
			return {
				labels: convertedTime,
				datasets: [
					{
						label: "GAS",
						fill: true,
						lineTension: 0.25,
						backgroundColor: gasGradientFill,
						borderColor: gasGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: gasGradientStroke,
						pointBackgroundColor: gasGradientStroke,
						pointHoverBackgroundColor: gasGradientStroke,
						pointHoverBorderColor: gasGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: gasPrices
					},
					{
						label: "NEO",
						fill: true,
						lineTension: 0.25,
						backgroundColor: gradientFill,
						borderColor: gradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: gradientStroke,
						pointBackgroundColor: gradientStroke,
						pointHoverBackgroundColor: gradientStroke,
						pointHoverBorderColor: gradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: neoPrices
					},
					{
						label: "BTC",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: btcGradientFill,
						borderColor: btcGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: btcGradientStroke,
						pointBackgroundColor: btcGradientStroke,
						pointHoverBackgroundColor: btcGradientStroke,
						pointHoverBorderColor: btcGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: btcPrices
					},
					{
						label: "QLC",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: qlcGradientFill,
						borderColor: qlcGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: qlcGradientStroke,
						pointBackgroundColor: qlcGradientStroke,
						pointHoverBackgroundColor: qlcGradientStroke,
						pointHoverBorderColor: qlcGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: qlcPrices
					},
					{
						label: "DBC",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: dbcGradientFill,
						borderColor: dbcGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: dbcGradientStroke,
						pointBackgroundColor: dbcGradientStroke,
						pointHoverBackgroundColor: dbcGradientStroke,
						pointHoverBorderColor: dbcGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: dbcPrices
					},
					{
						label: "RPX",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: rpxGradientFill,
						borderColor: rpxGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: rpxGradientStroke,
						pointBackgroundColor: rpxGradientStroke,
						pointHoverBackgroundColor: rpxGradientStroke,
						pointHoverBorderColor: rpxGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: rpxPrices
					},
					{
						label: "TNC",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: tncGradientFill,
						borderColor: tncGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: tncGradientStroke,
						pointBackgroundColor: tncGradientStroke,
						pointHoverBackgroundColor: tncGradientStroke,
						pointHoverBorderColor: tncGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: tncPrices
					},
					{
						label: "ZPT",
						fill: true,
						hidden: true,
						lineTension: 0.25,
						backgroundColor: zptGradientFill,
						borderColor: zptGradientStroke,
						borderCapStyle: "butt",
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: "miter",
						pointBorderWidth: 1,
						pointHoverRadius: 3,
						pointHoverBorderWidth: 0,
						pointBorderColor: zptGradientStroke,
						pointBackgroundColor: zptGradientStroke,
						pointHoverBackgroundColor: zptGradientStroke,
						pointHoverBorderColor: zptGradientStroke,
						pointHitRadius: 3,
						pointRadius: 0,
						data: zptPrices
					}
				]
			};
		};
		return (
			<div>
				<Assets />
				<div className="dash-chart-panel top-20">
					<div className="row">
						<div className="col-xs-12">
							<Line
								data={data}
								width={600}
								height={300}
								options={{
									maintainAspectRatio: true,
									layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
									scales: {
										xAxes: [
											{
												type: "time",
												position: "bottom",
												id: "x-axis-0",
												categoryPercentage: 1,
												barPercentage: 1,
												gridLines: { color: "rgba(255, 255, 255, 0.04)" }
											}
										],
										yAxes: [
											{
												gridLines: { color: "rgba(255, 255, 255, 0.04)" }
											}
										]
									},
									legend: {
										position: "bottom",
										labels: {
											boxWidth: 15,
											padding: 20
										}
									}
								}}
							/>
						</div>

					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price
});

Charts = connect(mapStateToProps)(Charts);

export default Charts;
