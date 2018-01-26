import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import neoLogo from "../images/neo.png";
import { Link } from "react-router";
import doughnut from "../img/doughnut.png";


class PortfolioCharts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gasPrice: 0,
        };
    }

    render() {
        return (
            <div>

                <div className="dash-chart-panel top-20">
                    <div className="row">
                        <div className="col-xs-12">
                            <Doughnut
                                data={[{
                                    value: 25
                                },
                                {
                                    value: 75,
                                    isEmpty: true
                                }]}
                                width={600}
                                height={220}
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

PortfolioCharts = connect(mapStateToProps)(PortfolioCharts);

export default PortfolioCharts;
