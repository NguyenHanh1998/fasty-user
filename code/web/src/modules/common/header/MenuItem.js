// Imports
import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

// UI Imports
import { white } from '../../../ui/common/colors'
import { primary, secondary } from '../../../ui/common/gradients'
import { level1 } from '../../../ui/common/shadows'

// Component
const MenuItem = (props) => {
  const { children, to, type, active, style, section } = props

  const isActiveRoute = () => {
    const currentSection = props.location.pathname.split('/')[1]
    // const toSection = 

    console.log('...', type)
    return (currentSection === to.split('/')[1] && currentSection === section)
      || props.location.pathname === to
      || active
      // || currentSection === to.split('/')[1]
  }

  return (
    <Link
      to={to}
      style={
        Object.assign({
          padding: '0.6em 1em',
          textTransform: 'uppercase',
          color: '#000000'
        }, isActiveRoute() ? {
          // backgroundImage: (type === 'secondary' ? secondary : 'fragment' ? '' : primary),
          borderRadius: (type === 'fragment' ? '' : '1.4em'),
          // boxShadow: (type === 'fragment' ? '' : level1),
          color: '#4caf50',
          fontWeight: 'bold'
        } : style)
      }
    >
      {children}
    </Link>
  )
}

// Component Properties
MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  type: PropTypes.string,
  active: PropTypes.bool,
  style: PropTypes.object
}
MenuItem.defaultProps = {
  type: 'secondary',
  active: false,
  style: {}
}

export default withRouter(MenuItem)