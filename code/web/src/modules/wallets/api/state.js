import { 
  IMPORT_WALLET,
  IMPORT_WALLET_RESPONSE,
  SET_WALLET,
  SET_WALLET_BALANCE,
  GET_LIST_TRANSACTIONS_HISTORY_REQUEST,
  GET_LIST_TRANSACTIONS_HISTORY_RESPONSE,
  GET_LIST_TRANSACTIONS_HISTORY_FAILURE,
  GET_TRANSACTION_DETAILS_REQUEST,
  GET_TRANSACTION_DETAILS_RESPONSE,
  GET_TRANSACTION_DETAILS_FAILURE
} from './actions'
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

const transactionsInitialState = {
  error: null,
  isLoading: false,
  list: [],
}

export const transactions = (state = transactionsInitialState, action) => {
  switch(action.type) {
    case GET_LIST_TRANSACTIONS_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null
      }

    case GET_LIST_TRANSACTIONS_HISTORY_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        list: action.transactionsList
      }

    case GET_LIST_TRANSACTIONS_HISTORY_FAILURE: 
      return {
        ...state,
        isLoading: false,
        error: action.error
      }

    default:
      return state
  }
}

const transactionInitialState = {
  error: null,
  isTransactionLoading: false,
  details: null
}

export const transaction = (state = transactionInitialState, action) => {
  switch(action.type) {
    case GET_TRANSACTION_DETAILS_REQUEST:
      return {
        ...state,
        isTransactionLoading: action.isLoading,
        error: null,
      }

    case GET_TRANSACTION_DETAILS_RESPONSE:
      return {
        ...state,
        isTransactionLoading: false,
        error: action.error,
        details: action.transaction
      }

    case GET_TRANSACTION_DETAILS_FAILURE:
      return {
        ...state,
        isTransactionLoading: false,
        error: action.error
      }

    default:
      return state
  }
}