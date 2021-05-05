// Imports
import React from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js';
import numeral from 'numeral';

import { APP_URL } from '../../setup/config/env'
import { timeFormatterAsText } from '../../utils/converter'
import { GatewaySC } from '../../services/gatewaySC';

const gateway = new GatewaySC();
const TransactionDetailModal = (props) => {
  const { visible, transaction, ...other } = props

  return (
    <div {...other} className="v-dialog__content v-dialog__content--active" style={{
      zIndex: 202,
      visibility: (visible ? 'visible' : 'hidden'),
      opacity: (visible ? 1 : 0),
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

      <div className="v-dialog v-dialog--active">
        <div className="tdm__wrap-content v-card v-sheet theme--light">
          <div>
            <div className="row tdm__container tdm__container__header">
              <div className="tdm__header col col-11">
                <div className="tdm__header-name">Transaction Detail</div>
              </div>
              <div className="col" style={{position: 'relative'}}>
                <img 
                  onClick={() => {props.onModalClose()}}
                  src={`${APP_URL}/images/wallets/cancel_black2.png`} 
                  style={{
                    position: 'absolute',
                    right: '50px',
                    top: '50%',
                    width: '25px',
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
              </div>
            </div>
          </div>

          {
            transaction ?
          
          <div className="row tdm__container">
            <div className="col col-3">
                  {/* product name  */}
                <div className="tdm__box-left">
                  <div className="tdm__box-title">Product Name</div>
                  <div className="tdm__box-info">
                <div className="tdm__box-name">{transaction.productName}</div>
                  </div>
                </div>

                  {/* date */}
                <div className="tdm__box-left">
                  <div className="tdm__box-title">Transaction Date</div>
                  <div className="tdm__box-info">
                    <div className="tdm__box-date"> 
                      {timeFormatterAsText(transaction.updatedAt, 'DD/MM/YYYY')} 
                    </div>
                    <div>
                      {timeFormatterAsText(transaction.updatedAt, 'HH:mm:ss')} 
                    </div>
                  </div>
                </div>
            </div>
            
            <div className="tdm__container__right col col-9">
              <div className="tdm__box-right">
                <div className="tdm__box-title">
                  <div>Transaction Information</div>
                  <div>
                    <a 
                      href={gateway.getTransactionUrl(transaction.txId)}
                      target="_blank">View on Ethersan</a>
                  </div>
                </div>

                <div className="tdm__address">
                  <div className="tdm__address__title">Buyer Address</div>
                  <div className="tdm__address__info">{transaction.buyerAddress}</div>
                  <div className="tdm__address__title">Seller Address</div>
                  <div className="tdm__address__info">{transaction.sellerAddress}</div>
                  <div className="tdm__address__title">Bought Price</div>
                  <div className="tdm__address__info">
                    { numeral(new BigNumber(transaction.price)
                                .dividedBy(Math.pow(10, 18)).toNumber())
                    .format('0,0.[00000000]')} {transaction.currency} 
                  </div>
                </div>
              </div>
            </div>
          </div>
          : <div>Empty</div>
          }   
        </div>
      </div>
    </div>
  )
}

TransactionDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired
}

TransactionDetailModal.defaultProps = {
  visible: false
}

export default TransactionDetailModal