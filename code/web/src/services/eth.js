
import { isValidPrivate, isValidAddress } from 'ethereumjs-util'
import * as ethers from 'ethers'
import { v4 as uuidv4 } from 'uuid'

import { infuraWeb3 } from './web3'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'
import { GatewaySC } from './gatewaySC'
import { convertBytesToUint128Number, formatUuid } from '../utils/converter'
import { SmartContractMethod } from '../constants'
const ERC721Gateway = new GatewaySC();
export class EthService {
  constructor(){}

  isValidAddress(address) {
    return isValidAddress(address);
  }

  isValidPrivateKey(userPrivateKey) {
    const privateKey = userPrivateKey.startsWith('0x')
      ? userPrivateKey.slice(2)
      : userPrivateKey;
    const hexReg = /^[0-9a-fA-F]+$/;

    return (
      hexReg.test(privateKey) && 
      isValidPrivate(Buffer.from(privateKey, 'hex'))
    );
  }

  importWalletByPrivateKey(userPrivateKey) {
    const privateKey = userPrivateKey.startsWith('0x')
      ? userPrivateKey.slice(2)
      : userPrivateKey;

    const wallet = new ethers.Wallet(privateKey);
    return {
      privateKey: userPrivateKey,
      ethAddress: wallet.address,
    }
  }

  async getAddressBalance(address) {
    try {
      const balance = await infuraWeb3.eth.getBalance(address);
      return {
        balance: numeral(
          new BigNumber(balance).dividedBy(Math.pow(10, 18)).toNumber()
        ).format('0,0.[00000000]'),
      };
    } catch (error) {
      // throw error;
      return {
        balance: 0,
      };
    }
  }

  async generateOrderId (retry) {
    const orderId = convertBytesToUint128Number(formatUuid(uuidv4()))
    if (retry === 0) {
      return null
    }
    try {
      // check order id existed?
      const isExistent = await this.hasExistedOrder(orderId)
      if (!isExistent || isExistent.toString() === 'false' || isExistent.toString() === '0') {
        return orderId
      }
      return this.generateOrderId(retry - 1)
    } catch (err) {
      return this.generateOrderId(retry - 1)
    }
  }

  async hasExistedOrder(orderId) {
    const result = await ERC721Gateway.readContract(SmartContractMethod.HAS_EXISTENT_ORDER, [orderId]);
    return result
  }

  async getEstimateTransactionFee(
    orderId,
    method,
    fromAddress,
    amount
  ) {
    if(!orderId) {
      orderId = this.generateOrderId(5);
    }
    return await ERC721Gateway.getEstimateTransactionFee(fromAddress, method, [orderId], amount)
  }

  async takeOrderByEther({
    privateKey,
    orderId,
    amount,
    priority
  }) {
    const wallet = this.importWalletByPrivateKey(privateKey);
    const params = [orderId];
    const orderDetails = await ERC721Gateway.readContract(SmartContractMethod.GET_ORDER_DETAILS, [orderId]);
    
    switch (parseInt(orderDetails.status)) {
      case 0: 
        const unsignedTx = await ERC721Gateway.constructRawTx(
          wallet.ethAddress, 
          SmartContractMethod.TAKE_ORDER_BY_ETHER,
          params,
          {
            value: amount
          },
          priority
        );
        // return;

        const signedTx = await ERC721Gateway.signRawTx(
          unsignedTx.unsignedRaw, 
          wallet.privateKey
        );
        const result = await ERC721Gateway.sendRawTx(signedTx.signedRaw, 5);
        return {
          txid: result.txid,
          status: orderDetails.status,
          rawTx: signedTx.signedRaw
        }
        
      case 1:
      case 2:
      case 3:
      default:
        return { status: orderDetails.status };
    }
  }
}

