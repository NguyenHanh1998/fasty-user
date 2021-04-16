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
import { Link, withRouter } from 'react-router-dom'
import Button from '../../ui/button'
import Loading from '../common/Loading'
import EmptyMessage from '../common/EmptyMessage'
import { getOneAddress, getAddressBalance } from './api/actions'
import { messageShow, messageHide } from '../common/api/actions'

class MyWalletsList extends PureComponent {


  refresh = (ethAddress) => {
    //call web3 to get balance wallet
    this.props.getAddressBalance(ethAddress);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallet.details.ethAddress !== this.props.wallet.details.ethAddress) {
      this.refresh(nextProps.wallet.details.ethAddress)
    }
  }

  componentDidMount() {
    if(!this.props.wallet.details.ethAddress) {
      this.props.getOneAddress()
      .then(response => {
        if(this.props.wallet.error && this.props.user.error.length > 0) {
          this.props.messageShow(this.props.wallet.error)

          window.setTimeout(() => {
            this.props.messageHide()
          }, 5000)
        } else {
          this.props.messageHide()
        }
      }).catch(err => {
        this.props.messageShow(this.props.wallet.error)

        window.setTimeout(() => {
          this.props.messageHide()
        }, 5000)
      })
    } else {
      const ethAddress = this.props.wallet.details.ethAddress
      if(ethAddress) {
        this.refresh(ethAddress);
      }
    }
  }

  render() {
    const { isLoading, details } = this.props.wallet
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
          {
            isLoading
              ? <Loading />
              : details
                ?
                <GridCell>
                  <WalletItem ethAddress={details.ethAddress} balance={details.balance}/>
                </GridCell>
                : <GridCell>
                    <EmptyMessage message="No wallet imported!" />
                </GridCell>
          }
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
  wallet: PropTypes.object.isRequired,
  getOneAddress: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired,
  getAddressBalance: PropTypes.func.isRequired
}

function myWalletsList(state) {
  return {
    user: state.user,
    wallet: state.wallet
  }
}

export default withRouter(connect(myWalletsList, { getOneAddress, getAddressBalance, messageShow, messageHide })(MyWalletsList))