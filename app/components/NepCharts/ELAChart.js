import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router";

// CryptoCompare API for ChartJS
const api = val => {
	return `https://min-api.cryptocompare.com/data/histohour?fsym=ELA&tsym=USD&limit=72&aggregate=3&e=CCCAGG`;
};

class Charts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			neoData: [],
			ontData: [],
			open: "--",
			high: "--",
			low: "--"
		};
	}

	async componentDidMount() {
		await this.getNeoData();
		await this.getOntData();
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
	// ONT
	async getOntData() {
		try {
			let req = await axios.get(api("ONT"));
			let data = req.data.Data;
			this.setState({ ontData: data });
		} catch (error) {
			console.log(error);
		}
	}

	// Chart Data
	render() {
		const neoPrices = _.map(this.state.neoData, "close");
		const neoHours = _.map(this.state.neoData, "time");

		const convertedTime = neoHours.map(val => moment.unix(val).format("LLL"));
		const ontPrices = _.map(this.state.ontData, "close");
		// Chart Styling
		const data = canvas => {
			let ctx = canvas.getContext("2d");
			let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, "#7ED321");
			gradientStroke.addColorStop(1, "#7ED321");

			let gradientFill = ctx.createLinearGradient(0, 0, 0, 360);
			gradientFill.addColorStop(0, "rgba(68,147,33, 0.5)");
			gradientFill.addColorStop(1, "rgba(68,147,33, 0)");
			const gradient = ctx.createLinearGradient(0, 0, 100, 0);


			// Chart Content
			return {
				labels: convertedTime,
				datasets: [
					{
						label: "ELA",
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
					}
				]
			};
		};
		return (
			<div id="no-inverse">
							<Line
								data={data}
								width={300}
								height={130}
								options={{
									maintainAspectRatio: false,
									layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
									scales: {
										xAxes: [
											{
												type: "time",
												position: "bottom",
												id: "x-axis-0",
												categoryPercentage: 1,
												barPercentage: 1,
												gridLines: { color: "rgba(255, 255, 255, 0.04)" },
												display: false
											}
										],
										yAxes: [
											{
												gridLines: { color: "rgba(255, 255, 255, 0.04)" }
											}
										]
									},
									legend: {
										display: false
									}
								}}
							/>
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
