import { GET_ESTIMATE_FEE_REQUEST, GET_ESTIMATE_FEE_RESPONSE, SET_ORDER } from './actions'

const orderInitialState = {
  error: null,
  isLoading: false,
  estimateFee: null
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
        estimateFee: action.estimateFee
      }
    
    default:
      return state
  }
}