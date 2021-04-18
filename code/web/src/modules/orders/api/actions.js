import { SmartContractMethod } from '../../../constants';
import { EthService } from '../../../services/eth'

export const GET_ESTIMATE_FEE_REQUEST = 'GET_ESTIMATE_FEE_REQUEST'
export const GET_ESTIMATE_FEE_RESPONSE = 'GET_ESTIMATE_FEE_RESPONSE'
export const SET_ORDER = 'SET_ORDER'

const ethService = new EthService();

export function getEstimateFee(orderId, method, fromAddress, amount, isLoading = true) {
  return async dispatch => {
    dispatch({
      type: GET_ESTIMATE_FEE_REQUEST,
      isLoading
    })

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

        console.log('*******************', estimateFee)

        dispatch({
          type: SET_ORDER,
          estimateFee: estimateFee
        })
      } catch(error) {
        console.log('????????????? err', error)
        dispatch({
          type: GET_ESTIMATE_FEE_RESPONSE,
          error: `${error}.Please try again!`
        })
      }
    }
  }
}