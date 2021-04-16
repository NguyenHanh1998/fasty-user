
import { isValidPrivate } from 'ethereumjs-util'
import * as ethers from 'ethers'
import { infuraWeb3 } from './web3'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'
export class EthService {
  constructor(){}

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
      privateKeyEth: userPrivateKey,
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
}

