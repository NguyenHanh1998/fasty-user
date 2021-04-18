import React, { PureComponent } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

import { grey, white } from '../../ui/common/colors'
import { Grid, GridCell } from '../../ui/grid'
import { H3 } from '../../ui/typography'
import { APP_URL } from '../../setup/config/env'
import { Input } from '../../ui/input'
import Button from '../../ui/button'
import Icon from '../../ui/icon'
import { getAddressBalance } from '../wallets/api/actions'
import { getEstimateFee } from '../orders/api/actions'
import { SmartContractMethod } from '../../constants'

const network = process.env.APP_NETWORK
const networkConfigs = require(`../../configs/eth/network/${network}.json`)

class ConfirmPayment extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      offerPrice: 0,
      orderId: null,
      estimateFee: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.order.estimateFee !== this.props.order.estimateFee) {
      const formatEstimateFee = numeral(new BigNumber(nextProps.order.estimateFee)
        .dividedBy(Math.pow(10, 18)).toNumber())
        .format('0,0.[00000000]');

      this.setState({
        estimateFee: formatEstimateFee
      })
    }
  }

  componentDidMount() {
    if(!this.props.wallet.details.balance) {
      this.props.getAddressBalance(this.props.wallet.details.ethAddress)
    }

    const offerPrice = numeral(new BigNumber(this.props.location.state.offerPrice)
      .dividedBy(Math.pow(10, 18)).toNumber())
      .format('0,0.[00000000]')
    this.setState({
      offerPrice: offerPrice,
      orderId: this.props.location.state.orderId
    })

    //get est fee
    console.log('//offer', typeof(new BigNumber(offerPrice).toNumber()))
    console.log('===',this.props.location.state.orderId, this.state.orderId, this.state.offerPrice)
    this.props.getEstimateFee(
      this.props.location.state.orderId,
      SmartContractMethod.TAKE_ORDER_BY_ETHER,
      this.props.wallet.details.ethAddress,
      this.props.location.state.offerPrice,
    )
  }


  render() {
    const { ethAddress, balance } = this.props.wallet.details
    return (
      <div>

        {/* SEO */}
        <Helmet>
          <title>Confirm Payment</title>
        </Helmet>

        {/* Top title bar */}
        <Grid style={{ backgroundColor: grey }}>
          <GridCell style={{ padding: '2em', textAlign: 'center' }}>
            <H3 font="secondary">Confirm Payment</H3>
          </GridCell>
        </Grid>

        <div className="container-md">
          <div className="information-wallet information-wallet__list-card">
            {/* card1 */}
            <div className="card card-1">
              <div style={{ alignSelf: 'center'}}>
                <img className="icon" src={`${APP_URL}/images/orders/ethereum-icon.png`} />
              </div>
              <div className="column2" style={{
                margin: '20px auto'
              }}>
                <div>
            <div className="label">Address</div>
                  <div className="value">{ethAddress}</div>
                </div>
              </div>
            </div>

            <div className="card card-2">
              <div style={{ alignSelf: 'center'}}>
                <img className="icon" src={`${APP_URL}/images/orders/wallet-icon.png`}/>
              </div>
              <div className="column2"  style={{
                margin: '20px auto'
              }}>
                <div>
                  <div className="label">Balance</div>
                  <div className="value">ETH {balance}</div>
                </div>
              </div>
            </div>

            <div className="card card-3">
              <div style={{ alignSelf: 'center'}}>
                <img className="icon" src={`${APP_URL}/images/orders/network-icon.png`}/>
              </div>
              <div className="column2"  style={{
                margin: '20px auto'
              }}>
                <div>
                  <div className="label">Network</div>
                  <div className="value">ETH Testnet(Rinkeby)</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            boxSizing: 'border-box'
          }} className="confirm">
            <div className="form ant-col-xl-16">
              {/* to address */}
              <div className="row ant-row">
                <div className="ant-col label ant-col-md-6">To Address</div>
                <div className="ant-col label ant-col-md-18">
                  <div className="to-address input__numberic">
                    <input className="input" placeholder="Destinate wallet address" disabled={true} value={networkConfigs.tokenContractAddress} type="text"/>
                  </div>
                </div>
              </div>

              {/* amount */}
              <div className="row ant-row">
                <div className="ant-col label ant-col-md-6">ETH Amount</div>
                <div className="ant-col label ant-col-md-18">
                  <div className="to-address input__numberic">
                    <input className="input" placeholder="amount" type="text" disabled={true} value={this.state.offerPrice}/>
                  </div>
                </div>
              </div>

              {/* estimate fee */}
              <div className="row ant-row row-estimate">
                <div className="ant-col label ant-col-md-6">Estimated Fee</div>
                <div className="ant-col field ant-col-md-18">
                  {this.state.estimateFee} ETH
                </div>
              </div>

              {/* priority */}
              <div className="row ant-row row-priority">
                <div className="ant-col label ant-col-md-6">Priority</div>
                  <div className="ant-col field ant-col-md-18">
                    <div className="ant-radio-group ant-radio-group-solid">
                      <label className="ant-radio-button-wrapper">
                        <span className="ant-radio-button">
                        </span>
                        <span>Low</span>
                      </label>

                      <label className="ant-radio-button-wrapper ant-radio-button-wrapper-checked">
                        <span className="ant-radio-button">
                        </span>
                        <span>Medium</span>
                      </label>

                      <label className="ant-radio-button-wrapper">
                        <span className="ant-radio-button">
                        </span>
                        <span>High</span>
                      </label>
                    </div>
                  </div>
              </div>

              {/* estimate fee */}
              <div className="row ant-row row-balance">
                <div className="ant-col label ant-col-md-6">ETH Balance</div>
                <div className="ant-col field ant-col-md-18">
                  {balance} ETH
                </div>
              </div>

              {/* button  */}
              <div className="row ant-row row-action">
              <div className="ant-col label ant-col-md-6"></div>
                <div className="ant-col field ant-col-md-18" style={{ textAlign: 'center' }}>
                  {this.props.wallet.isLoading || this.props.order.isLoading ?
                    <Button type="submit" theme="secondary" disabled={true}>
                      <Icon size={1.2} style={{ color: white }}>check</Icon>Estimating Fee...
                    </Button>
                    :
                    <Button type="submit" theme="secondary">
                      <Icon size={1.2} style={{ color: white }}>check</Icon> Confirm Payment
                    </Button>
                  }
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

ConfirmPayment.propTypes = {
  wallet: PropTypes.object.isRequired,
  getAddressBalance: PropTypes.func.isRequired,
  getEstimateFee: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired
}

function confirmPayment(state) {
  return {
    wallet: state.wallet,
    order: state.order
  }
}


export default withRouter(connect(confirmPayment, { getAddressBalance, getEstimateFee }) (ConfirmPayment))