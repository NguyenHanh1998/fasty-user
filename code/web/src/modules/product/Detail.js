// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

// UI Imports
import { Grid, GridCell } from '../../ui/grid'
import Card from '../../ui/card/Card'
import { H2, H3, H4 } from '../../ui/typography'
import { grey, grey2 } from '../../ui/common/colors'
import Button from '../../ui/button'
import Icon from '../../ui/icon'
import { white } from '../../ui/common/colors'

// App Imports
import { routeImage, routes } from '../../setup/routes'
import { renderIf } from '../../setup/helpers'
import { get } from './api/actions'
import Loading from '../common/Loading'
import Related from './Related'
import { messageShow, messageHide } from '../common/api/actions'
import orderRoutes from '../../setup/routes/order'

// Component
class Detail extends PureComponent {

  // Runs on server only for SSR
  static fetchData({ store, params }) {
    return store.dispatch(get(params.slug))
  }

  // Runs on client only
  componentDidMount() {
    this.refresh(this.props.match.params.slug)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.slug !== this.props.match.params.slug) {
      this.refresh(nextProps.match.params.slug)
    }
  }

  refresh = (slug) => {
    this.props.get(slug)
  }

  validateWalletAmount() {
    if (!this.props.wallet.details || !this.props.wallet.details.ethAddress) {
      this.props.messageShow('Not wallet was imported!')

      window.setTimeout(() => {
        this.props.messageHide()
      }, 5000)
    } else {
      // check balance
      const walletBalance = new BigNumber(this.props.wallet.details.balance)
      const offerPrice = numeral(new BigNumber(this.props.product.item.price)
      .dividedBy(Math.pow(10, 18)).toNumber())
      .format('0,0.[00000000]');

      if (walletBalance.lt(offerPrice)) {
        this.props.messageShow("Insufficient wallet\'s balance to buy this product!")

        window.setTimeout(() => {
          this.props.messageHide()
        }, 5000)
      } else if(walletBalance.eq(offerPrice)) {
        this.props.messageShow("Insufficient wallet\\'s balance to pay network fee!")

        window.setTimeout(() => {
          this.props.messageHide()
        }, 5000)
      }

      //
    }
  }

  takeOrderByEth() {
    this.validateWalletAmount()

    //if success -> direct to confirm payment page
    this.props.history.push({
      pathname: orderRoutes.confirmPayment.path,
      state: { 
        offerPrice: this.props.product.item.price,
        orderId: this.props.product.item.orderId
      }
    })
  }

  render() {
    const { isLoading, item, error } = this.props.product

    return (
      <div>
        {
          !error
            ? isLoading
              ? <Loading/>
              : renderIf(item && item.id, () => (
                  <div>
                    {/* SEO */}
                    <Helmet>
                      <title>{`Product - ${ item.name }`}</title>
                      <meta name="description" content={`Product - ${ item.name }`} />
                      <meta property="og:title" content={`Product - ${ item.name }`} />
                      <meta property="og:image" content={routeImage + item.image} />
                      <meta property="og:description" content={`Product - ${ item.name }`} />
                    </Helmet>

                    {/* Top title bar */}
                    <Grid style={{ backgroundColor: grey }}>
                      <GridCell style={{ padding: '2em', textAlign: 'center' }}>
                        <H3 font="secondary">Product</H3>
                      </GridCell>
                    </Grid>

                    {/* Product Details */}
                    <Grid gutter={true} alignCenter={true} style={{ padding: '2em' }}>
                      {/* Left Content - Image */}
                      <GridCell style={{ maxWidth: '35em' }}>
                        <Card>
                          <img src={routeImage + item.image} alt={item.name} style={{ width: '100%' }}/>
                        </Card>
                      </GridCell>

                      {/* Right Content */}
                      <GridCell style={{ textAlign: 'center' }}>
                        <H2 font="secondary">{item.name}</H2>

                        <H4 style={{ marginTop: '1em' }}>{item.description}</H4>

                        <p style={{ marginTop: '0.5em', color: grey2 }}>
                          Launched on { new Date(parseInt(item.createdAt)).toDateString() }
                        </p>

                        <div style={{
                          width: '350px',
                          marginTop: '3.5em',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          textAlign: 'left',
                          fontSize: '14px'
                        }}>
                          <H4 style={{ marginTop: '1em' }}>Currency : {(item.currency).toUpperCase()}</H4>
                          <H4 style={{ marginTop: '1em' }}>Offer Price : {
                            numeral( new BigNumber(item.price).
                            dividedBy(Math.pow(10, 18)).toNumber()).
                            format('0,0.[00000000]')} ETH</H4>
                        </div>

                        <Button theme="primary" style={{ marginTop: '3em' }} onClick={this.takeOrderByEth.bind(this)} >Buy Now <Icon size={1.2} style={{ color: white }}>navigate_next</Icon></Button>
                      </GridCell>
                    </Grid>

                    {/* Related products title bar */}
                    <Grid style={{ backgroundColor: grey }}>
                      <GridCell style={{ padding: '2em', textAlign: 'center' }}>
                        <H3 font="secondary">Related Products</H3>
                      </GridCell>
                    </Grid>

                    {/* Related products list */}
                    <Related productId={item.id}/>
                  </div>
                ))
            : <Redirect to={routes.home.path}/>
        }
      </div>
    )
  }
}

// Component Properties
Detail.propTypes = {
  wallet: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  get: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
  messageHide: PropTypes.func.isRequired
}

// Component State
function detailState(state) {
  return {
    product: state.product,
    wallet: state.wallet,
    user: state.user
  }
}

export default withRouter(connect(detailState, { get, messageHide, messageShow })(Detail))
