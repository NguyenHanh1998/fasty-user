import axios from 'axios'

import { EthService } from '../../../services/eth'
import { routeApi } from '../../../setup/routes'

export const IMPORT_WALLET = 'IMPORT_WALLET'
export const IMPORT_WALLET_RESPONSE = 'IMPORT_WALLET_RESPONSE'
export const GET_ONE_ADDRESS = 'GET_ONE_ADDRESS'
export const SET_WALLET = 'SET_WALLET'
export const GET_ADDRESS_BALANCE_REQUEST = 'GET_ADDRESS_BALANCE_REQUEST'
export const GET_ADDRESS_BALANCE_RESPONSE = 'GET_ADDRESS_BALANCE_RESPONSE'
export const SET_WALLET_BALANCE = 'SET_WALLET_BALANCE';
export const GET_LIST_TRANSACTIONS_HISTORY_REQUEST = 'GET_LIST_TRANSACTIONS_HISTORY_REQUEST';
export const GET_LIST_TRANSACTIONS_HISTORY_RESPONSE = 'GET_LIST_TRANSACTIONS_HISTORY_RESPONSE';
export const GET_LIST_TRANSACTIONS_HISTORY_FAILURE = 'GET_LIST_TRANSACTIONS_HISTORY_FAILURE';
export const GET_TRANSACTION_DETAILS_REQUEST = 'GET_TRANSACTION_DETAILS_REQUEST';
export const GET_TRANSACTION_DETAILS_RESPONSE = 'GET_TRANSACTION_DETAILS_RESPONSE';
export const GET_TRANSACTION_DETAILS_FAILURE = 'GET_TRANSACTION_DETAILS_FAILURE';

const ethService = new EthService();

export function importWallet(privateKey, isLoading = true) {
  return dispatch => {
    dispatch({
      type: IMPORT_WALLET,
      isLoading
    })

     // validate private key 
    if(!privateKey)
    {
      dispatch({
        type: IMPORT_WALLET_RESPONSE,
        error: 'Private Key is required!'
      })
    } else {

      const privateKeyFormat = privateKey.startsWith('0x')
        ? privateKey.slice(2)
        : privateKey;

      if(!ethService.isValidPrivateKey(privateKeyFormat)) {
        dispatch({
          type: IMPORT_WALLET_RESPONSE,
          error: 'Private Key is invalid!'
        })
      } else {
        try{
          const { ethAddress } = ethService.importWalletByPrivateKey(privateKeyFormat);

          return axios({
            method: 'post',
            url: `${routeApi}/addresses/create`,
            data: {
              privateKey: privateKeyFormat,
              address: ethAddress
            }
          })
            .then(response => {
              let error = ''
      
              if(response.data.errors && response.data.errors.length > 0) {
                error = response.data.errors[0].message
              } else if (response.data.data.address !== '') {
                const address = response.data.data.address
                const wallet = { ethAddress: address }
                dispatch({
                  type: SET_WALLET,
                  wallet
                })
              }
            })
            .catch(error => {
              dispatch({
                type: IMPORT_WALLET_RESPONSE,
                error: `${error}.Please try again!`,
              })
            }) 
        } catch(err) {
          dispatch({
            type: IMPORT_WALLET_RESPONSE,
            error: 'Could not import by private key, something went wrong!!',
          })
        }
      }
    }
  }
}

export function getOneAddress() {
  return dispatch => {
    dispatch({
      type: GET_ONE_ADDRESS,
      isLoading: true
    })

    return axios({
      method: 'get',
      url: `${routeApi}/addresses/detail`
    })
    .then(response => {
      let error = ''

      if(response.data.errors && response.data.errors.length > 0) {
        error = response.data.errors[0].message
      } else if (response.data.data.address !== '') {
        const address = response.data.data.address
        const privateKey = response.data.data.privateKey
        const wallet = { ethAddress: address, privateKey:  privateKey}
        dispatch({
          type: SET_WALLET,
          wallet
        })
      }
    })
    .catch(error => {
      if(error.response.data.meta.code === 404 &&
        error.response.data.meta.message === 'Address not found') {
          dispatch({
            type: SET_WALLET,
            wallet: null
          })
          dispatch({
            type: IMPORT_WALLET_RESPONSE,
            error: 'Import your wallet now',
          })
        } else {
          dispatch({
            type: IMPORT_WALLET_RESPONSE,
            error: `${error}.Please try again!`,
          })
        }
    }) 
  }
}

export function getAddressBalance(ethAddress, isLoading = true) {
  return async dispatch => {
    dispatch({
      type: GET_ADDRESS_BALANCE_REQUEST,
      isLoading
    })

    try{
      const addressBalance = await ethService.getAddressBalance(ethAddress);
      dispatch({
        type: SET_WALLET_BALANCE,
        balance: addressBalance.balance
      })
    } catch(err) {
      dispatch
    }
  }
}

export function getListTransactions(isLoading = true) {
  return dispatch => {
    dispatch({
      type: GET_LIST_TRANSACTIONS_HISTORY_REQUEST,
      error: null,
      isLoading
    })

    return axios.get(`${routeApi}/transactions/user`)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: GET_LIST_TRANSACTIONS_HISTORY_RESPONSE,
            error: null,
            isLoading: false,
            transactionsList: response.data.data
          })
        } else {
          dispatch({
            type: GET_LIST_TRANSACTIONS_HISTORY_FAILURE,
            error: response.data.meta.message,
            isLoading: false
          })
        }
      })
      .catch(error => {
        dispatch({
          type: GET_LIST_TRANSACTIONS_HISTORY_FAILURE,
          error: error.response.data.meta.message + '. Please try again!',
          isLoading: false
        })
      })
  }
}

export function getTransactionDetails(orderId, isLoading = true) {
  return dispatch => {
    dispatch({
      type: GET_TRANSACTION_DETAILS_REQUEST,
      error: null,
      isLoading
    })

    return axios.get(`${routeApi}/transactions/${orderId}`)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: GET_TRANSACTION_DETAILS_RESPONSE,
            error: null,
            isLoading: false,
            transaction: response.data.data
          })
        } else {
          dispatch({
            type: GET_TRANSACTION_DETAILS_FAILURE,
            error: response.data.meta.message,
            isLoading: false
          })
        }
      })
      .catch(error => {
        dispatch({
          type: GET_TRANSACTION_DETAILS_FAILURE,
          error: error.response.data.meta.message + '. Please try again!',
          isLoading: false
        })
      })
  }
}