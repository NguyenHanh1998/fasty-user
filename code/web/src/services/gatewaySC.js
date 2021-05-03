import BigNumber from 'bignumber.js';

const network = process.env.APP_NETWORK
const networkConfigs = require(`../configs/eth/network/${network}.json`)
const { abi: contractAbi } = require('../configs/abi/FastyToken.json');
const { infuraWeb3 } = require('./web3')
const EthereumTx = require('ethereumjs-tx')
export class GatewaySC {

  constructor() {
    this.contract = new infuraWeb3.eth.Contract(contractAbi, networkConfigs.tokenContractAddress)
  }

  async getEstimateTransactionFee(fromAddress, method, params, amount) {
    const gasPrice = await this.getGasPrice(1);
    const transactionFunc = this.contract.methods[method](...params);
    const estimateGas = await transactionFunc.estimateGas({
      from: fromAddress,
      value: amount ? parseInt(amount) : 0
    })
    let finalGasLimit = infuraWeb3.utils.toBN(estimateGas).muln(1.5);
    // check maximum gas, default maximum is 10.000.000
    if (finalGasLimit.gte(infuraWeb3.utils.toBN('10000000'))) {
      finalGasLimit = infuraWeb3.utils.toBN('10000000');
    }
    return finalGasLimit * gasPrice;
  }

  async getGasPrice(priority) {
    try {
      const gasPrice = await infuraWeb3.eth.getGasPrice();
      let valuePriority = 1;
      switch (priority) {
        case 0:
          valuePriority = 0.75;
          break;
        case 2:
          valuePriority = 1.5;
          break;
        default:
          valuePriority = 1;
          break;
      }
      return Math.round(gasPrice * valuePriority);
    } catch(error) {
      throw error;
    }
  }

  async readContract(method, params) {
    return await this.contract.methods[method](...params).call()
  }

  async constructRawTx(fromAddress, method, params, options, priority = 2) {
    const nonce = await infuraWeb3.eth.getTransactionCount(fromAddress, 'pending');
    
    const gasPrice = await this.getGasPrice(priority);
    const transactionFunc = this.contract.methods[method](...params);
    const estimateGas = await transactionFunc.estimateGas({
      from: fromAddress,
      value: infuraWeb3.utils.toHex(options && options.value ? options.value : 0)
    })
    // return;
    let finalGasLimit = infuraWeb3.utils.toBN(estimateGas).muln(1.5);
    // check maximum gas, default maximum is 10.000.000
    if (finalGasLimit.gte(infuraWeb3.utils.toBN('10000000'))) {
      finalGasLimit = infuraWeb3.utils.toBN('10000000');
    }

    console.log('======params', {
      chainId: networkConfigs.chainId,
      data: transactionFunc.encodeABI(),
      gasLimit: infuraWeb3.utils.toHex(finalGasLimit),
      gasPrice: infuraWeb3.utils.toHex(gasPrice),
      nonce: infuraWeb3.utils.toHex(nonce),
      to: networkConfigs.tokenContractAddress,
      value: infuraWeb3.utils.toHex(options && options.value ? options.value : 0)
    });

    const rawTx = new EthereumTx({
      chainId: networkConfigs.chainId,
      data: transactionFunc.encodeABI(),
      gasLimit: infuraWeb3.utils.toHex(finalGasLimit),
      gasPrice: infuraWeb3.utils.toHex(gasPrice),
      nonce: infuraWeb3.utils.toHex(nonce),
      to: networkConfigs.tokenContractAddress,
      value: infuraWeb3.utils.toHex(options && options.value ? options.value : 0)
    });

    return {
      txid: `0x${rawTx.hash().toString('hex')}`,
      unsignedRaw: rawTx.serialize().toString('hex'),
    }
  }

  async signRawTx(unsignedRaw, secret) {
    if(secret.startsWith('0x')) {
      secret = secret.substr(2);
    }
    const ethTx = new EthereumTx(unsignedRaw);
    const privateKey = Buffer.from(secret, 'hex');
    ethTx.sign(privateKey);

    return {
      txid: `0x${ethTx.hash().toString('hex')}`,
      signedRaw: ethTx.serialize().toString('hex'),
      unsignedRaw
    }
  }

  async sendRawTx(signedRawTx, retryCount) {
    if(!signedRawTx.startsWith('0x')) {
      signedRawTx = '0x' + signedRawTx;
    }
    const ethTx = new EthereumTx(signedRawTx);
    let txid = ethTx.hash().toString('hex');
    if (!txid.startsWith('0x')) {
      txid = '0x' + txid;
    }
    if(!retryCount || isNaN(retryCount)) {
      retryCount = 0;
    }
    try {
      const resultObj = await infuraWeb3.eth.sendSignedTransaction(signedRawTx);
      return { txid: resultObj.transactionHash };
    } catch (e) {
      if (
        e.toString().indexOf('known transaction') > -1 ||
        e.toString().indexOf('already known') > -1
      ) {
        return { txid };
      }

      if (
        e.toString().indexOf('Transaction has been reverted by the EVM') > -1
      ) {
        return { txid };
      }

      if (retryCount + 1 > 5) {
        console.error(
          `Too many fails sending txid=${txid} tx=${JSON.stringify(
            ethTx.toJSON()
          )} err=${e.toString()}`
        );
        throw e;
      }

      return this.sendRawTx(signedRawTx, retryCount + 1);
    }
  }
}