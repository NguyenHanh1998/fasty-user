
import { isValidPrivate } from 'ethereumjs-util'
import * as ethers from 'ethers'
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
}

