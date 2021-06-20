// Imports
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// UI Imports
import Card from '../../ui/card/Card'
import H4 from '../../ui/typography/H4'
import { white, grey2, black } from '../../ui/common/colors'

// App Imports
import { routeImage, routes } from '../../setup/routes'
import { H5 } from '../../ui/typography'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'

// Component
const Item = (props) => {

  const { id, name, slug, description, image, price } = props.product

  return (
    <Link to={routes.product.path(slug)}>
      <Card style={{ width: '20em', height: '22em', margin: '2.5em auto', backgroundColor: white }}>
        <img src={routeImage + image} alt={name} style={{ width: '250px', height: '250px' }}/>

        <div style={{ display: 'flex' }}>
          <div style={{ padding: '1em 1.2em' }}>
            <H4 font="secondary" style={{ color: black}}>{ name }</H4>

            <p style={{ color: grey2, marginTop: '1em'}}>{ description }</p>
          </div>
          <div style={{  }}>
            <H4 font="secondary" style={{ color: black, marginLeft: '40px', paddingTop: '0.7em' }}>ETH</H4>
            <H5 style={{ color: black, marginTop: '0.3em'}} >{ numeral(new BigNumber(price).dividedBy(Math.pow(10, 18)).toNumber()).format('0,0.[00000000]')}</H5>
          </div>
        </div>
      </Card>
    </Link>
  )
}

// Component Properties
Item.propTypes = {
  product: PropTypes.object.isRequired
}

export default Item
