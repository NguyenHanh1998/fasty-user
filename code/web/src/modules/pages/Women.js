// Imports
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { PureComponent } from 'react'

// UI Imports
import { Grid, GridCell } from '../../ui/grid'
import { H2, H5 } from '../../ui/typography'
import Button from '../../ui/button'
import ImageTile from '../../ui/image/Tile'
import { level1 } from '../../ui/common/shadows'

// App Imports
import { APP_URL } from '../../setup/config/env'
import crateRoutes from '../../setup/routes/crate'
import userRoutes from '../../setup/routes/user'
import { getList as getProductList } from '../product/api/actions'
import Loading from '../common/Loading'
import EmptyMessage from '../common/EmptyMessage'
import ProductItem from '../product/Item'

// Component
class Women extends PureComponent {

  // Runs on client only
  componentDidMount() {
    this.props.getProductList()
  }

  render () {
    const { isLoading, list } = this.props.products

    return (
      <div>
        <Grid alignCenter={true} style={{ padding: '2em' }}>
          {/* SEO */}
          <Helmet>
            <title>Monthly supply of clothes and accessories for Women - Crate</title>
          </Helmet>

          {/* Left Content - Image Collage */}
          <GridCell>
            <Grid gutter={true} alignCenter={true}>
              <GridCell justifyCenter={true}>
                <ImageTile width={300} height={530} shadow={level1} image={`${ APP_URL }/images/stock/women/1.jpg`} />
              </GridCell>

              <GridCell>
                <Grid>
                  <GridCell justifyCenter={true}>
                    <ImageTile width={170} height={250} shadow={level1} image={`${ APP_URL }/images/stock/women/2.jpg`} />
                  </GridCell>
                </Grid>

                <Grid>
                  <GridCell justifyCenter={true}>
                    <ImageTile width={170} height={250} shadow={level1} image={`${ APP_URL }/images/stock/women/3.jpg`} style={{ marginTop: '1.9em' }} />
                  </GridCell>
                </Grid>
              </GridCell>
            </Grid>
          </GridCell>

          {/* Right Content */}
          <GridCell style={{ textAlign: 'center' }}>
            <H2 font="secondary">Monthly crates for Women</H2>

            <H5 style={{ marginTop: '0.5em' }}>
              Save time. Look great. The personal styling service customized to your fit, lifestyle & spending preferences.
            </H5>

            {/* Call to action */}
            {
              this.props.user.isAuthenticated
                ? <Link to={crateRoutes.list.path}>
                    <Button theme="secondary" style={{ marginTop: '1em' }}>Get Subscription</Button>
                  </Link>
                : <Link to={userRoutes.signup.path}>
                    <Button theme="secondary" style={{ marginTop: '1em' }}>Get Started</Button>
                  </Link>
            }
          </GridCell>
        </Grid>

        {/* Product list */}
        <Grid style={{ backgroundColor: '#ffffff' }}>
        {
          isLoading
            ? <Loading/>
            : list && list.length > 0
              ? list.map(product => (
                  <GridCell key={product.id} style={{ textAlign: 'center' }}>
                    <ProductItem product={product}/>
                  </GridCell>
                ))
              : <EmptyMessage message="No products to show" />
          }
        </Grid>
      </div>
    )
  }
}

// Component Properties
Women.propTypes = {
  user: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  getProductList: PropTypes.func.isRequired
}

// Component State
function womenState(state) {
  return {
    user: state.user,
    products: state.products
  }
}

export default connect(womenState, {getProductList})(Women)
