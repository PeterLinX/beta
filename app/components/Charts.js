import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";

const url =
  "https://min-api.cryptocompare.com/data/histoday?fsym=NEO&tsym=USD&limit=20&aggregate=3&e=CCCAGG";

const gasApi =
  "https://min-api.cryptocompare.com/data/histoday?fsym=GAS&tsym=USD&limit=20&aggregate=3&e=CCCAGG";

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: [],
      gasData: []
    };
  }

  async componentDidMount() {
    try {
      await this.getGasData();
      let req = await axios.get(url);
      let data = req.data.Data;
      this.setState({ price: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getGasData() {
    try {
      let req = await axios.get(gasApi);
      let data = req.data.Data;
      this.setState({ gasData: data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const prices = _.map(this.state.price, "close");
    const days = _.map(this.state.price, "time");

    const gasPrices = _.map(this.state.gasData, "close");
    const gasDays = _.map(this.state.gasData, "time");
    const data = canvas => {
      let ctx = canvas.getContext("2d");
      let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#7ED321");
      gradientStroke.addColorStop(1, "#7ED321");

      let gradientFill = ctx.createLinearGradient(0, 0, 0, 380);
      gradientFill.addColorStop(0, "rgba(68,147,33,0.8)");
      gradientFill.addColorStop(1, "rgba(68,147,33,0)");
      const gradient = ctx.createLinearGradient(0, 0, 100, 0);

      let gasGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gasGradientStroke.addColorStop(0, "#9013FE");
      gasGradientStroke.addColorStop(1, "#9013FE");

      let gasGradientFill = ctx.createLinearGradient(0, 0, 0, 380);
      gasGradientFill.addColorStop(0, "rgba(144,147,254, 1)");
      gasGradientFill.addColorStop(1, "rgba(144,147,254, 0)");

      return {
        labels: days,
        datasets: [
          {
            label: "Neo Price",
            fill: true,
            lineTension: 0.1,
            backgroundColor: gradientFill,
            borderColor: gradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 5,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointHitRadius: 10,
            pointRadius: 3,
            data: prices
          },
          {
            label: "Gas Price",
            fill: true,
            lineTension: 0.1,
            backgroundColor: gasGradientFill,
            borderColor: gasGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 5,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointBorderColor: gasGradientStroke,
            pointBackgroundColor: gasGradientStroke,
            pointHoverBackgroundColor: gasGradientStroke,
            pointHoverBorderColor: gasGradientStroke,
            pointHitRadius: 10,
            pointRadius: 3,
            data: gasPrices
          }
        ]
      };
    };
    return (
      <div>
        <div className="settings-panel">
          <div className="row">
            <div className="col-xs-12">
              <Line data={data} />
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
