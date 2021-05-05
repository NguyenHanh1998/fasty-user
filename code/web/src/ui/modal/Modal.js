// Imports
import React from 'react'
import PropTypes from 'prop-types'
import { H4 } from '../typography'
import { black, white } from '../common/colors'
import { Input } from '../input'
import Button from '../button'
import Icon from '../icon'
import { APP_URL } from '../../setup/config/env'

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
      <div style={{
        width: '650px',
        transformOrigin: '587.988px 205.012px',
        boxSizing: 'border-box',
        color: 'rgba(0,0,0,.85)',
        fontSize: '14px',
        fontVariant: 'tabular-nums',
        lineHeight: '1.5715',
        listStyle: 'none',
        pointerEvents: 'none',
        position: 'relative',
        top: '230px',
        maxWidth: 'calc(100vw - 32px)',
        margin: '0 auto',
        padding: '0 0 24px'
      }}>
        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#fff',
          backgroundClip: 'padding-box',
          border: 0,
          boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
          pointerEvents: 'auto',
        }}>
          <div style={{
            padding: '0',
            fontSize: '14px',
            lineHeight: '1.5715'
          }}>
          <H4 style={{
            fontWeight: 700,
            color: '#fff',
            backgroundColor: '#3e3a39',
            padding: '30px',
            textAlign: 'center',
            position: 'relative',
            marginBottom: '.5em',
            fontSize: '20px',
            lineHeight: '1.4'
          }}>{title}
          
            <img 
              onClick={() => {props.onModalClose()}}
              src={`${APP_URL}/images/wallets/cancel.png`} 
              style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                display: 'inline-block',
                color: 'inherit',
                fontStyle: 'normal',
                lineHeight: 0,
                textAlign: 'center',
                textTransform: 'none',
                verticalAlign: '-.125em',
                textRendering: 'optimizeLegibility'
              }}
            />
          </H4>

            {/** body form */}
          <div style={{
            padding: '20px 55px 55px',
            textAlign: 'center'
          }}>
          {children}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

// Component Properties
Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
}
Modal.defaultProps = {
  visible: false
}

export default Modal