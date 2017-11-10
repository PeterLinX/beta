import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";

const neoApi =
  "https://min-api.cryptocompare.com/data/histoday?fsym=NEO&tsym=USD&limit=21&aggregate=3&e=CCCAGG";

const gasApi =
  "https://min-api.cryptocompare.com/data/histoday?fsym=GAS&tsym=USD&limit=21&aggregate=3&e=CCCAGG";

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      neoData: [],
      gasData: []
    };
  }

  async componentDidMount() {
    await this.getGasData();
    await this.getNeoData();
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

  async getNeoData() {
    try {
      let req = await axios.get(neoApi);
      let data = req.data.Data;
      this.setState({ neoData: data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const neoPrices = _.map(this.state.neoData, "close");
    const neoDays = _.map(this.state.neoData, "time");

    const gasPrices = _.map(this.state.gasData, "close");
    const gasDays = _.map(this.state.gasData, "time");

    const data = canvas => {
      let ctx = canvas.getContext("2d");
      let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#7ED321");
      gradientStroke.addColorStop(1, "#7ED321");

      let gradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      gradientFill.addColorStop(0, "rgba(68,147,33,0.8)");
      gradientFill.addColorStop(1, "rgba(68,147,33,0)");
      const gradient = ctx.createLinearGradient(0, 0, 100, 0);

      let gasGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gasGradientStroke.addColorStop(0, "#9013FE");
      gasGradientStroke.addColorStop(1, "#9013FE");

      let gasGradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      gasGradientFill.addColorStop(0, "rgba(144,147,254, 1)");
      gasGradientFill.addColorStop(1, "rgba(144,147,254, 0)");

      return {
        labels: neoDays,
        datasets: [

          {
            label: "Gas",
            fill: true,
            lineTension: 0.5,
            backgroundColor: gasGradientFill,
            borderColor: gasGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 5,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointBorderColor: gasGradientStroke,
            pointBackgroundColor: gasGradientStroke,
            pointHoverBackgroundColor: gasGradientStroke,
            pointHoverBorderColor: gasGradientStroke,
            pointHitRadius: 0,
            pointRadius: 0,
            data: gasPrices
          },
          {
            label: "Neo",
            fill: true,
            lineTension: 0.5,
            backgroundColor: gradientFill,
            borderColor: gradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 5,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointHitRadius: 0,
            pointRadius: 0,
            data: neoPrices
          }]
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
