import { IMPORT_WALLET, IMPORT_WALLET_RESPONSE, SET_WALLET, SET_WALLET_BALANCE } from './actions'
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
      let walletFormated = Object.assign({}, state.details)
      walletFormated.ethAddress = action.wallet.ethAddress
      walletFormated.privateKey = action.wallet.privateKey
      return {
        ...state,
        error: null,
        isLoading: false,
        details: walletFormated
      }

    case SET_WALLET_BALANCE:
      let newWallet = Object.assign({}, state.details)
      newWallet.balance = action.balance
      return {
        ...state,
        error: null,
        isLoading: false,
        details: newWallet
      }
    default:
      return state
  }
}