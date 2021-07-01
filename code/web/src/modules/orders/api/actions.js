import axios from 'axios';
import BigNumber from 'bignumber.js';
import numeral from 'numeral'
 
import { ERROR_TYPES } from '../../../configs/exception/errorTypes';
import { SmartContractMethod } from '../../../constants';
import { EthService } from '../../../services/eth'
import { routeApi } from '../../../setup/routes';
import ConfirmPayment from '../ConfirmPayment';

export const GET_ESTIMATE_FEE_REQUEST = 'GET_ESTIMATE_FEE_REQUEST'
export const GET_ESTIMATE_FEE_RESPONSE = 'GET_ESTIMATE_FEE_RESPONSE'
export const SET_ORDER = 'SET_ORDER'
export const CONFIRM_PAYMENT_REQUEST = 'CONFIRM_PAYMENT_REQUEST'
export const CONFIRM_PAYMENT_RESPONSE = 'CONFIRM_PAYMENT_RESPONSE'
export const SET_TAKE_ORDER_RESPONSE = 'SET_TAKE_ORDER_RESPONSE'

const ethService = new EthService();

export function getEstimateFee(orderId, method, fromAddress, amount, isLoading = true) {
  return async dispatch => {
    dispatch({
      type: GET_ESTIMATE_FEE_REQUEST,
      isLoading
    })

    console.log('...........', orderId, method, fromAddress, amount)

    if(!orderId || !method || !fromAddress || !amount) {
      dispatch({
        type: GET_ESTIMATE_FEE_RESPONSE,
        error: 'Param for get estimate fee cannot null! Try again.'
      })
    } else {
      try {
        const estimateFee = await ethService.getEstimateTransactionFee(
          orderId,
          method,
          fromAddress,
          amount
        );

        console.log('&&&&estmate', estimateFee)

        dispatch({
          type: SET_ORDER,
          estimateFee: estimateFee
        })
      } catch(error) {
        dispatch({
          type: GET_ESTIMATE_FEE_RESPONSE,
          error: `${error}.Please try again!`
        })
      }
    }
  }
}

export function confirmPayment(params, isLoading = true) {
  return async dispatch => {
    dispatch({
      type: CONFIRM_PAYMENT_REQUEST,
      isLoading
    })
    const { orderId, wallet, amount, transactionFee, toAddress } = params;

    try {
      const errorMessage = validatePayment(wallet, amount, transactionFee, toAddress);
      if(errorMessage) {
        dispatch({
          type: CONFIRM_PAYMENT_RESPONSE,
          error: errorMessage
        })
        return;
      }

      const request = { 
        privateKey: wallet.privateKey,
        orderId,
        amount
      }
      const response = await ethService.takeOrderByEther(request);
      
      switch(parseInt(response?.status)) {
        case 0:
          if (response?.txid) {
            const dataRequest = {
              orderId: orderId,
              txid: response?.txid,
              rawTx: response?.rawTx,
              toAddress: toAddress
            }
            //confirm buy eth
            //call api takeOrderByEth
            return axios({
              method: 'post',
              url: `${routeApi}/orders/take_by_eth`,
              data: dataRequest
            })
            .then(response => {
              let error = ''
              if(response.data.errors && response.data.errors.length > 0) {
                error = response.data.errors[0].message
                dispatch({
                  type: CONFIRM_PAYMENT_RESPONSE,
                  error: error
                })
              } else if (response.data.meta.message === 'Successful') {
                const takeOrder = true;
                dispatch({
                  type: SET_TAKE_ORDER_RESPONSE,
                  takeOrder,
                  orderTxid: dataRequest.txid
                })
              }
            })
            .catch(error => {
              dispatch({
                type: CONFIRM_PAYMENT_RESPONSE,
                error: error
              })
            })
          } {
            // error fail
            dispatch({
              type: CONFIRM_PAYMENT_RESPONSE,
              error: ERROR_TYPES.CONFIRM_PAYMENT_FAILED
            })
          }
          return;
        
        case 1: 
          //error product is hold
          dispatch({
            type: CONFIRM_PAYMENT_RESPONSE,
            error: ERROR_TYPES.PRODUCT_HOLD
          })
          return;
        
        case 2: 
          //error product is sold
          dispatch({
            type: CONFIRM_PAYMENT_RESPONSE,
            error: ERROR_TYPES.PRODUCT_SOLD
          })
          return;
        
        case 3: 
          //error product is cancel
          dispatch({
            type: CONFIRM_PAYMENT_RESPONSE,
            error: ERROR_TYPES.PRODUCT_CANCEL
          })
          return;
        }
      } catch(e) {
        console.log('err', e)
        //error fail res
        dispatch({
          type: CONFIRM_PAYMENT_RESPONSE,
          error: ERROR_TYPES.CONFIRM_PAYMENT_FAILED
        })
    }
  }


} 

function validatePayment(
  wallet,
  amount,
  transactionFee,
  toAddress
) {
  // validate address
  const { ethAddress: sendAddress } = wallet;
  if(!toAddress) {
    return ERROR_TYPES.TO_ADDRESS_REQUIRED;
  }

  if( sendAddress === toAddress) {
    return ERROR_TYPES.CANNOT_SEND_TO_SAME_ADDRESS;
  }
  if(!amount) {
    return ERROR_TYPES.AMOUNT_IS_REQUIRED;
  }

  const isValidAddress = ethService.isValidAddress(toAddress);
  if(!isValidAddress) {
    return ERROR_TYPES.RECEIVE_ADDRESS_INVALID;
  }
  // check amount >< transFee + balance
  const parseAmount = new BigNumber(numeral(amount)._value || 0)
    .toFixed()
    .toString();

  const walletBalance =  numeral(new BigNumber(wallet.balance)
    .multipliedBy(Math.pow(10, 18)).toNumber())._value

  if(
    new BigNumber(parseAmount).plus(transactionFee).toNumber() >
    walletBalance
  ) {
    return ERROR_TYPES.INSUFFICIENT_WALLET;
  }
}