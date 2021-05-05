import React, { PureComponent } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';

// UI Imports
import { Grid, GridCell } from '../../ui/grid'
const { default: WalletMenu } = require('./common/Menu');
import { H4 } from '../../ui/typography';

// App Imports
import { messageShow, messageHide } from '../common/api/actions'
import { getListTransactions, getTransactionDetails } from './api/actions'
import EmptyMessage from '../common/EmptyMessage'
import Loading from '../common/Loading'
import TransactionDetailModal from '../../ui/modal/TransactionDetailModal';
import { timeFormatterAsText } from '../../utils/converter';

class TransactionHistory extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isModal: false
    }
  }

  componentDidMount() {
    this.props.getListTransactions()
  }

  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.transaction.details) {
  //     this.setState({ isModal: true });
  //   } 
  // }

  onModalClose = () => {
    this.setState({ isModal: false })
  }

  seeTransactionDetail(orderId) {
    this.setState({ isModal: true });
    this.props.getTransactionDetails(orderId);
  }

  render() {
    const { isLoading, list } = this.props.transactions
    const { isTransactionLoading, details } = this.props.transaction
    return (
      <div>
        <Helmet>
          <title>History - My Wallet</title>
        </Helmet>

        {/* Top menu bar */}
        <WalletMenu />

        {/* Page Content */}
        <div>
          {/* Transaction List */}
          <Grid alignCenter={true} style={{ padding: '1em' }}>
            <GridCell>
              <table className="striped">
                <thead>
                  <tr>
                    {/* <th>No</th> */}
                    <th>Date Time</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    isLoading
                      ? <tr>
                          <td colSpan="6">
                            <Loading message="loading transactions..."/>
                          </td>
                        </tr>
                      : list.length > 0 
                        ? list.map(({ id, productName, price, currency, createdAt, updatedAt }) => (
                          <tr key={id}>
                            {/* <td>
                              1
                            </td> */}

                            <td>
                              { timeFormatterAsText(updatedAt, 'DD/MM/YYYY') }
                            </td>

                            <td>
                              { productName }
                            </td>

                            <td>
                              { numeral(new BigNumber(price)
                                .dividedBy(Math.pow(10, 18)).toNumber())
                                .format('0,0.[00000000]') } { currency }
                            </td>

                            <td style={{ textAlign: 'center' }}> 
                                <H4 style={{
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  color: '#7367F0'
                                  }} onClick={() => {this.seeTransactionDetail(id)}}>Views</H4>
                            </td>
                          </tr>
                        ))
                        : <tr>
                            <td colSpan="6">
                              <EmptyMessage message="No transactions history to show."/>
                            </td>
                          </tr>
                  }
                </tbody>
              </table>

              {
                isTransactionLoading ?
                  <Loading message="loading transaction details..."/>
                : <TransactionDetailModal 
                    visible={this.state.isModal}
                    onModalClose={this.onModalClose}
                    transaction={details ? details : null}
                  />
              }
            </GridCell>
          </Grid>
        </div>
      </div>
    )
  }

}

TransactionHistory.propTypes = {
  transactions: PropTypes.object.isRequired,
  getListTransactions: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired,
  getTransactionDetails: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
}

function transactionsHistoryState(state) {
  return {
    transactions: state.transactions,
    transaction: state.transaction
  }
}

export default connect(transactionsHistoryState, { getListTransactions, getTransactionDetails, messageHide, messageShow }) (TransactionHistory)