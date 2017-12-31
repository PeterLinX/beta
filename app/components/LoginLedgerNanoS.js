// @flow
import React, { Component } from "react";
import { Link } from "react-router";
import { ROUTES } from "../core/constants"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ledgerNanoSGetLogin, ledgerNanoSGetInfoAsync, getPublicKey, getHardwareDeviceInfo, getHardwarePublicKeyInfo } from '../../modules/account'

const mapStateToProps = (state: Object) => ({
  publicKey: getPublicKey(state),
  hardwareDeviceInfo: getHardwareDeviceInfo(state),
  hardwarePublicKeyInfo: getHardwarePublicKeyInfo(state)
})

const actionCreators = {
  ledgerNanoSGetInfoAsync,
  ledgerNanoSGetLogin
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginLedgerNanoS)

type Props = {
  ledgerNanoSGetLogin: Function,
  ledgerNanoSGetInfoAsync: Function,
  hardwareDeviceInfo: string,
  hardwarePublicKeyInfo: string,
  publicKey: string,
  history: Object
}

export default class LoginLedgerNanoS extends Component<Props> {
  componentDidMount () {
    this._componentDidMount(this.props.ledgerNanoSGetInfoAsync)
  }

  _componentDidMount = async (getInfoAsync: Function) => {
    await getInfoAsync()
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
        <div className="row">Login using the Ledger Nano S:</div>
        <div className="">
          <div>
            <div className="grey-btn" onClick={this.onLedgerNanoSChange}>Use Ledger Nano S</div>
          </div>
          <p>{hardwareDeviceInfo}</p>
          <p>{hardwarePublicKeyInfo}</p>
        </div>
      </div>
    )
  }
}
