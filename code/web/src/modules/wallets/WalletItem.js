import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { black, grey2, white } from '../../ui/common/colors';
import { H4 } from '../../ui/typography';
import { APP_URL } from '../../setup/config/env'

const WalletItem = (props) => {
    const ethAddress = props.ethAddress
    const balance = props.balance
    return (
      <div style={{ 
        maxWidth: '525px',
        margin: '45px auto',
        boxShadow: '0 0 0 0'
        }}>
        <div style={{
          backgroundImage: 'linear-gradient( 90deg, #FEB692 10%, #EA5455 100%)',
          borderRadius: '30px',
          padding: '35px',
          boxShadow: '20px 20px 0 0 rgba(51,0,101,.15)'
        }}>
          {/* head */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <img style={{
              left: '30px',
              top: '50%',
              maxWidth: '200px',
              display: 'inline-block',
            }} src={`${APP_URL}/images/wallets/ethereum-logo-landscape-black.png`}/>
          </div>

          {/* body */}
          <div style={{ 
            color: '#fff',
            paddingLeft: '35px',
            paddingTop: '30px' 
          }}>
            <H4 style={{
              fontWeight: '700',
              marginBottom: '10px',
              fontSize: '20px',
              lineHeight: '1.4'
            }}> Wallet Address</H4>

            <div style={{
              fontSize: '16px',
              marginBottom: '20px'
            }}>{ ethAddress }</div>

            {/* balance */}
            <div style={{
              fontSize: '26px',
              fontWeight: '700',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'grid'
              }}>ETH {balance}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

WalletItem.propTypes = {
  ethAddress: PropTypes.object.isRequired
}
export default WalletItem