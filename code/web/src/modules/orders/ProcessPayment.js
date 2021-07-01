import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { APP_URL } from '../../setup/config/env'
import { H4, H5 } from '../../ui/typography'
import Button from '../../ui/button'
import { GatewaySC } from '../../services/gatewaySC';
import homeRoutes from '../../setup/routes/home'

const gateway = new GatewaySC();
const ProcessPayment = (props) => {
  const { txid } = props.location.state.orderTxid;

  return (
    <div>
      <div className="container-md">
        <form style={{
              boxSizing: 'border-box',
              marginTop: '50px'
            }} className="confirm">
            <div style={{ textAlign: '-webkit-center' }}>
              <div style={{ paddingTop: '40px', width: '500px', color: '#969696' }}>
                <H5> Your payment is processing on blockchain network and it will take for a while. </H5>
                <H5> Please wait...</H5>
              </div>
              <img src={`${APP_URL}/images/orders/hourglass.png`} style={{ width: '250px', height: '280px', margin: '40px 0' }} />

              {/* button  */}
                {/* <div className="ant-col label ant-col-md-6"></div> */}
                  <div style={{ textAlign: 'center', display: 'grid', width: '300px' }}>
                    <a href={gateway.getTransactionUrl(txid)} target="_blank" style={{ color: '#ffffff' }}>
                      <Button theme="secondary" backgroundColor="#dba734">
                        View Payment Process
                      </Button>
                    </a>
                    <div style={{ height: '30px' }}></div>
                    <Link to={homeRoutes.whatsNew.path}>
                      <Button type="submit" theme="secondary">
                        Continue Purchase
                      </Button>
                    </Link>
                    <div style={{ height: '30px' }}></div>
                  </div>
                </div>
          </form>
      </div>
    </div>
  )
}

ProcessPayment.propsType = {
  txid: PropTypes.string.isRequired,
}

export default ProcessPayment