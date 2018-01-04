// @flow
import React, { Component } from "react";
import { Link } from "react-router";
import { ROUTES } from "../core/constants";

type Props = {
  ledgerNanoSGetLogin: Function,
  ledgerNanoSGetInfoAsync: Function,
  hardwareDeviceInfo: string,
  hardwarePublicKeyInfo: string,
  publicKey: string,
  history: Object
}

export const FINDING_LEDGER_NOTICE = "Looking for USB Devices. Please plugin your device and login."

export default class LoginLedgerNanoS extends Component<Props, State> {
  state = {
    intervalId: ""
  }

  componentDidMount () {
    const { ledgerNanoSGetInfoAsync } = this.props
    const intervalId = setInterval(async () => {
      await ledgerNanoSGetInfoAsync()
    }, 1000)
    this.setState({ intervalId })
  }

  shouldComponentUpdate (nextProps) {
    const { publicKey, hardwarePublicKeyInfo, hardwareDeviceInfo } = this.props
    if (nextProps.publicKey !== publicKey ||
        nextProps.hardwarePublicKeyInfo !== hardwarePublicKeyInfo ||
        (nextProps.hardwareDeviceInfo === FINDING_LEDGER_NOTICE && hardwareDeviceInfo === null)) return true
    return false
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalId)
  }

  onLedgerNanoSChange = () => {
    const { ledgerNanoSGetLogin, publicKey, history } = this.props
    if (publicKey) {
      ledgerNanoSGetLogin()
      history.push(ROUTES.DASHBOARD)
    }
  }

  render () {
    const { hardwareDeviceInfo, hardwarePublicKeyInfo, publicKey } = this.props
    return (
      <div>
      <div id="">
        <div >Login using the Ledger Nano S:</div>
        <div >
          <div>
            <button className="" onClick={this.onLedgerNanoSChange}>Use Ledger Nano S</button>

          </div>
          <p>{hardwareDeviceInfo}</p>
          <p>{hardwarePublicKeyInfo}</p>
        </div>
      </div>
      </div>
    )
  }
}
