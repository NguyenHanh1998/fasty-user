// Imports
import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// App Imports
import wallet from '../../setup/routes/wallet'

// Component
const WalletCheck = (props) => (
  (props.wallet.details && props.wallet.details.ethAddress) ? <Redirect to={wallet.walletList.path}/> : ''
)

// Component Properties
WalletCheck.propTypes = {
  wallet: PropTypes.object.isRequired
}

// Component State
function walletCheckState(state) {
  return {
    wallet: state.wallet
  }
}

export default connect(walletCheckState, {})(WalletCheck)
