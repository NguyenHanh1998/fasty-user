import { IMPORT_WALLET, IMPORT_WALLET_RESPONSE, SET_WALLET } from './actions'
import { isEmpty } from '../../../setup/helpers'

const walletInitialState = {
  error: null,
  isLoading: false,
  details: null
}

export const wallet =  (state = walletInitialState, action) => {
  switch(action.type) {
    case IMPORT_WALLET:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }
    
    case IMPORT_WALLET_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }

    case SET_WALLET:
      return {
        ...state,
        error: null,
        isLoading: false,
        details: action.wallet
      }

    default:
      return state
  }
}