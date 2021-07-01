import { 
  GET_ESTIMATE_FEE_REQUEST, 
  GET_ESTIMATE_FEE_RESPONSE, 
  SET_ORDER,
  CONFIRM_PAYMENT_REQUEST,
  CONFIRM_PAYMENT_RESPONSE,
  SET_TAKE_ORDER_RESPONSE
} from './actions'

const orderInitialState = {
  error: null,
  isLoading: false,
  estimateFee: null,
  takeOrder: false,
  orderTxid: '',
}

export const order = (state = orderInitialState, action) => {
  switch(action.type) {
    case GET_ESTIMATE_FEE_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }

    case GET_ESTIMATE_FEE_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }

    case SET_ORDER:
      return {
        ...state,
        error: null,
        isLoading: false,
        estimateFee: action.estimateFee,
        takeOrder: false
      }

    case CONFIRM_PAYMENT_REQUEST: 
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }

    case CONFIRM_PAYMENT_RESPONSE: 
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    
    case SET_TAKE_ORDER_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: null,
        takeOrder: action.takeOrder,
        orderTxid: action.orderTxid
      }
    default:
      return state
  }
}