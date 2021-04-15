import ERROR_TYPES from '../../../configs/errorTypes'
import { EthService } from '../../../services/eth'

export const IMPORT_WALLET = 'IMPORT_WALLET'
export const IMPORT_WALLET_RESPONSE = 'IMPORT_WALLET_RESPONSE'
export const SET_WALLET = 'SET_WALLET'

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
          const wallet = { privateKeyFormat, ethAddress }
          dispatch({
            type: SET_WALLET,
            wallet
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