import axios from 'axios'

import { EthService } from '../../../services/eth'
import { routeApi } from '../../../setup/routes'

export const IMPORT_WALLET = 'IMPORT_WALLET'
export const IMPORT_WALLET_RESPONSE = 'IMPORT_WALLET_RESPONSE'
export const GET_ONE_ADDRESS = 'GET_ONE_ADDRESS'
export const SET_WALLET = 'SET_WALLET'
export const GET_ADDRESS_BALANCE_REQUEST = 'GET_ADDRESS_BALANCE_REQUEST'
export const GET_ADDRESS_BALANCE_RESPONSE = 'GET_ADDRESS_BALANCE_RESPONSE'

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
      url: `${routeApi}/addresses`
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
      console.log('? error', error.response)
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
        type: SET_WALLET,
        wallet: { ethAddress, balance: addressBalance.balance} 
      })
    } catch(err) {
      dispatch
    }
  }
}