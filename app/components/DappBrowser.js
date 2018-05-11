import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";
import Slider from "react-slick";
import { shell, clipboard } from "electron";

import AddListing from "./Dapps/AddListing";
import AdvListing from "./Dapps/AdvListing";
import LRNListing from "./Dapps/LRNListing";
import IMUListing from "./Dapps/IMUListing";
import NNSListing from "./Dapps/NNSListing";
import GDMListing from "./Dapps/GDMListing";

import Search from "./Search";

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class DappBrowser extends Component {

	render() {
		var settings = {
      dots: false,
      infinite: true,
			centerPadding: "1px",
      slidesToShow: 1,
			autoplay: true,
			draggable: false,
			touchMove: false,
			swipe: false,
			fade: false,
      autoplaySpeed: 10000,
      speed: 500,
      slidesToScroll: 1
    };
		return (
			<div>

			<div className="breadBar">
	    <div className="col-flat-10">
	    <ol id="no-inverse" className="breadcrumb">
	    </ol>
	    </div>

	    <div className="col-flat-2">
	    <Search />
	    </div>
	    </div>



			<div id="no-inverse" className="pointer">
			<Slider {...settings}>
			<div>
				<Link to="gdmSale"><div className="guardiumSale" /></Link>
			</div>
			<div>
			<div
			onClick={() =>
		  openExplorer("https://goo.gl/forms/3r4vfKSmHtf3JJX82")
		  }
			><div className="morphSale" /></div>
			</div>
      </Slider>
			</div>

			<div className="row top-20 dash-portfolio center">
			<div id="assetList">

      <Link to="advancedTokenSale"><AdvListing /></Link>
			<Link to="gdmSale"><GDMListing /></Link>
      <Link onClick={() =>
		  openExplorer("https://goo.gl/forms/3r4vfKSmHtf3JJX82")
		  }><AddListing /></Link>
			<div className="com-soon"><IMUListing /></div>
			<div className="com-soon"><LRNListing /></div>
			<div className="com-soon"><NNSListing /></div>



			</div>
			</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
});

DappBrowser = connect(mapStateToProps)(DappBrowser);
export default DappBrowser;
