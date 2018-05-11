import React, { Component } from "react";

class ThemeSwitch extends Component {
  constructor(props) {
    super(props);

    this.css = `
      html { filter: invert(100%); background: #fff; background-image: none;}
      #no-inverse, dropMenuButton, .dropMenu, #mainNav, button { filter: invert(100%); }
      input, .form-send-neo, .form-send-gas, .form-send-rpx, .form-send-btc, .form-send-dbc, .form-send-qlc, .form-send-thor, .form-send-white, .form-send-hp { border: 1px solid #7b7b7b; }
      .dash-panel, .dash-chart-panel, .dash-panel-full, .dash-panel-history, .header, .col-5, .col-3, .col-5:hover, .col-3:hover {background: #000; border: 0px solid #272727; box-shadow: 2px 2px 0px #171717;}
      .col-5 {border: 1px;}
      body {background-image: none; background-color: #0e0e0e; color: #848484;}
      .col-5, .col-3, input, textarea, button, .header, .dash-panel, .dash-panel-full, .dash-chart-panel {border-radius: 0;}
      .dash-portfolio h3 {color: #646464}
      .donutchart-track { fill: transparent; stroke: #ddd;}
      `;

    if (this.props.preserveRasters) {
      this.css += 'img:not([src*=".svg"]), video, [style*="url("] { filter: invert(100%) } .gas-button { filter: invert(100%); }';
    }

    this.supported = this.isDeclarationSupported('filter', 'invert(100%)');

    this.state = {
      active: false
    };

    this.toggle = this.toggle.bind(this);
  }

  isDeclarationSupported (property, value) {
    var prop = property + ':',
        el = document.createElement('test'),
        mStyle = el.style;
    el.style.cssText = prop + value;
    return mStyle[property];
  }

  toggle() {
    this.setState({
      active: !this.state.active
    });
  }

  componentDidMount() {
    if (this.props.store) {
      this.setState({
        supported: this.isDeclarationSupported('filter', 'invert(100%)'),
        active: this.props.store.getItem(this.props.storeKey) || false
      });
    }
  }

  componentDidUpdate() {
    if (this.props.store) {
      this.props.store.setItem(this.props.storeKey, this.state.active);
    }
  }

  render() {
    if (!this.supported) {
      return null;
    }

    return (
      <div>
        <div aria-pressed={this.state.active} onClick={this.toggle}>
        <span className="glyphicon glyphicon-adjust"/> <span aria-hidden="true">{this.state.active ? 'Lights On' : 'Lights Off'}</span>
        </div>
        <style media={this.state.active ? 'screen' : 'none'}>
          {this.state.active ? this.css.trim() : this.css}
        </style>
      </div>
    );
  }
}

ThemeSwitch.defaultProps = {
  preserveRasters: true,
}

export default ThemeSwitch;
