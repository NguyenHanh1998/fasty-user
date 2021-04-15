// Imports
import React from 'react'
import PropTypes from 'prop-types'
import { H4 } from '../typography'
import { black, white } from '../common/colors'
import { Input } from '../input'
import Button from '../button'
import Icon from '../icon'

// Component
const Modal = (props) => {
  const { children, visible, title, ...other } = props

  return (
    <div {...other} style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 9,
      visibility: (visible ? 'visible' : 'hidden'),
      opacity: (visible ? 1 : 0),
      transition: 'opacity 0.25s ease-in-out'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,.45)',
        backgroundSize: 'cover',
        position: 'fixed',
        top: '-40px',
        right: '-40px',
        bottom: '-40px',
        left: '-40px',
        zIndex: -1,
        filter: 'blur(25px)'
      }}/>

      {children}
      
    </div>
  )
}

// Component Properties
Modal.propTypes = {
  visible: PropTypes.bool.isRequired
}
Modal.defaultProps = {
  visible: false
}

export default Modal