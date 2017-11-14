import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import neoLogo from "../images/neo.png";

// In a new Javascript file create a variable for new websocket
var ws = new WebSocket("wss://api.bitfinex.com/ws");

// Create function to send on open
ws.onopen = function() {
  ws.send(
    JSON.stringify({ event: "subscribe", channel: "ticker", pair: "NEOUSD" })
  );
};

// Tell function what to do when message is received and log messages to "neo-price" div
ws.onmessage = function(msg) {
  // create a variable for response and parse the json data
  var response = JSON.parse(msg.data);
  // save hb variable from bitfinex
  var hb = response[1];
  if (hb != "hb") {
    document.getElementById("neo-price").innerHTML =
      "<li>ASK: $" +
      response[3] +
      "</li><li> LAST: $" +
      response[7] +
      "</li><li> BID: $" +
      response[1] +
      "</li>";
  }
};

var currentTime = Date.now();

const neoApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=NEO&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

const gasApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=GAS&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

const ltcApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=LTC&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

const btcApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

const dashApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=DASH&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

const ethApi =
  "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=96&aggregate=3&e=CCCAGG";

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      neoData: [],
      gasData: [],
      btcData: [],
      dashData: [],
      ltcData: [],
      ethData: []
    };
  }

  async componentDidMount() {
    await this.getGasData();
    await this.getNeoData();
    await this.getBtcData();
    await this.getLtcData();
    await this.getDashData();
    await this.getEthData();
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

  async getBtcData() {
    try {
      let req = await axios.get(btcApi);
      let data = req.data.Data;
      this.setState({ btcData: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getLtcData() {
    try {
      let req = await axios.get(ltcApi);
      let data = req.data.Data;
      this.setState({ ltcData: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getEthData() {
    try {
      let req = await axios.get(ethApi);
      let data = req.data.Data;
      this.setState({ ethData: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getDashData() {
    try {
      let req = await axios.get(dashApi);
      let data = req.data.Data;
      this.setState({ dashData: data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const neoPrices = _.map(this.state.neoData, "close");
    const neoHours = _.map(this.state.neoData, "time");

    const convertedTime = neoHours.map(val => moment.unix(val).format("LLL"));

    const ltcPrices = _.map(this.state.ltcData, "close");
    const btcPrices = _.map(this.state.btcData, "close");
    const dashPrices = _.map(this.state.dashData, "close");
    const ethPrices = _.map(this.state.ethData, "close");
    const gasPrices = _.map(this.state.gasData, "close");

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

      let ltcGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      ltcGradientStroke.addColorStop(0, "#ececec");
      ltcGradientStroke.addColorStop(1, "#ececec");

      let ltcGradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      ltcGradientFill.addColorStop(0, "rgba(255,255,255, 0.5)");
      ltcGradientFill.addColorStop(1, "rgba(255,255,255, 0)");

      let btcGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      btcGradientStroke.addColorStop(0, "#ffc000");
      btcGradientStroke.addColorStop(1, "#ffc000");

      let btcGradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      btcGradientFill.addColorStop(0, "rgba(229,172,0, 0.5)");
      btcGradientFill.addColorStop(1, "rgba(229,172,0, 0)");

      let ethGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      ethGradientStroke.addColorStop(0, "#646464");
      ethGradientStroke.addColorStop(1, "#646464");

      let ethGradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      ethGradientFill.addColorStop(0, "rgba(175,175,175, 0.5)");
      ethGradientFill.addColorStop(1, "rgba(175,175,175, 0)");

      let dashGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      dashGradientStroke.addColorStop(0, "#005aff");
      dashGradientStroke.addColorStop(1, "#005aff");

      let dashGradientFill = ctx.createLinearGradient(0, 0, 0, 240);
      dashGradientFill.addColorStop(0, "rgba(0,90,255, 0.5)");
      dashGradientFill.addColorStop(1, "rgba(0,90,255, 0)");

      return {
        labels: convertedTime,
        datasets: [
          {
            label: "GAS",
            fill: true,
            lineTension: 0.5,
            backgroundColor: gasGradientFill,
            borderColor: gasGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
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
            lineTension: 0.5,
            backgroundColor: gradientFill,
            borderColor: gradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
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
            lineTension: 0.5,
            backgroundColor: btcGradientFill,
            borderColor: btcGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
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
            label: "DASH",
            fill: true,
            hidden: true,
            lineTension: 0.5,
            backgroundColor: dashGradientFill,
            borderColor: dashGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 0,
            pointBorderColor: dashGradientStroke,
            pointBackgroundColor: dashGradientStroke,
            pointHoverBackgroundColor: dashGradientStroke,
            pointHoverBorderColor: dashGradientStroke,
            pointHitRadius: 3,
            pointRadius: 0,
            data: dashPrices
          },
          {
            label: "ETH",
            fill: true,
            hidden: true,
            lineTension: 0.5,
            backgroundColor: ethGradientFill,
            borderColor: ethGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 0,
            pointBorderColor: ethGradientStroke,
            pointBackgroundColor: ethGradientStroke,
            pointHoverBackgroundColor: ethGradientStroke,
            pointHoverBorderColor: ethGradientStroke,
            pointHitRadius: 3,
            pointRadius: 0,
            data: ethPrices
          },
          {
            label: "LTC",
            fill: true,
            hidden: true,
            lineTension: 0.5,
            backgroundColor: ltcGradientFill,
            borderColor: ltcGradientStroke,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderWidth: 3,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 0,
            pointBorderColor: ltcGradientStroke,
            pointBackgroundColor: ltcGradientStroke,
            pointHoverBackgroundColor: ltcGradientStroke,
            pointHoverBorderColor: ltcGradientStroke,
            pointHitRadius: 3,
            pointRadius: 0,
            data: ltcPrices
          }
        ]
      };
    };
    return (
      <div>
        <div className="settings-panel">
          <div className="row">
          <div className="col-xs-12">
          <div className="col-xs-4">
          <img src={neoLogo} alt="" width="34" className="neo-logo logobounce" /><h3 className="neo-dash-price">NEO Prices</h3>
          </div>
          <div className="col-xs-6"><ul id="neo-price"></ul>
          </div>
          <div className="col-xs-2">
          <select
            name="select-profession"
            id="dash-price-select"
            className=""
          >
            <option
              defaultValue
              selected="selected"
              disabled="disabled"
            >
            USD
            </option>
            <option>
            AUD
            </option>
            <option>
            CAD
            </option>
            <option>
            CNY
            </option>
            <option>
            EUR
            </option>
            <option>
            GBP
            </option>
            <option>
            JPY
            </option>
          </select>
          </div>
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
                        categoryPercentage: 0.8,
                        barPercentage: 0.8,
                        gridLines: { color: "rgba(255, 255, 255, 0.03)" }
                      }
                    ],
                    yAxes: [
                      {
                        gridLines: { color: "rgba(255, 255, 255, 0.02)" }
                      }
                    ]
                  },
                  legend: { position: "bottom" }
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
