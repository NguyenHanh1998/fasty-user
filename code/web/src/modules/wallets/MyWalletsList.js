import React ,{ PureComponent } from'react'
import { Helmet } from'react-helmet'
import { grey, grey2, white } from'../../ui/common/colors'
import { Grid, GridCell } from'../../ui/grid'
import { H3 } from'../../ui/typography'
import WalletItem from './WalletItem'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import userRoutes from '../../setup/routes/user'
import walletRoutes from '../../setup/routes/wallet'
import Icon from '../../ui/icon'
import { Link } from 'react-router-dom'
import Button from '../../ui/button'

class MyWalletsList extends PureComponent {
  render() {
    return (
      <div>
        {/* SEO */}
        <Helmet>
          <title>My Wallets List</title>
        </Helmet>

        {/* Top title bar */}
        <Grid style={{ backgroundColor: grey }}>
          <GridCell style={{ padding: '2em', textAlign: 'center' }}>
            <H3 font="secondary">My Wallets</H3>

            <p style={{ marginTop: '1em', color: grey2 }}>The wallets you imported to be listed here. You can import a new wallet.</p>
          </GridCell>
        </Grid>

        {/* Wallets list */}
        <Grid>
          <GridCell style={{ textAlign: 'center'}}>
            <WalletItem />
          </GridCell>
        </Grid>

        {/* Bottom call to action bar */}
        <Grid style={{ backgroundColor: grey }}>
          <GridCell style={{ padding: '3em', textAlign: 'center' }}>
            <p style={{ marginBottom: '1em', color: grey2 }}>Like what you see?</p>

            {
              this.props.user.isAuthenticated
                ? <Link to={walletRoutes.importWallet.path}>
                    <Button theme="primary">
                      Import Wallet <Icon size={1.2} style={{ color: white }}>navigate_next</Icon>
                    </Button>
                  </Link>
                : <Link to={userRoutes.signup.path}>
                    <Button theme="primary">Start <Icon size={1.2} style={{ color: white }}>navigate_next</Icon></Button>
                  </Link>
            }
          </GridCell>
        </Grid>
      </div>
    )
  }
}

MyWalletsList.propTypes = {
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired
}

function myWalletsList(state) {
  return {
    user: state.user,
    wallet: state.wallet
  }
}

export default connect(myWalletsList)(MyWalletsList)