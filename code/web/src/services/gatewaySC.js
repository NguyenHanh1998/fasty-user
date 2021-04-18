import BigNumber from 'bignumber.js';

const network = process.env.APP_NETWORK
const networkConfigs = require(`../configs/eth/network/${network}.json`)
const { abi: contractAbi } = require('../configs/abi/FastyToken.json');
const { infuraWeb3 } = require('./web3')
export class GatewaySC {

  constructor() {
    this.contract = new infuraWeb3.eth.Contract(contractAbi, networkConfigs.tokenContractAddress)
  }

  async getEstimateTransactionFee(fromAddress, method, params, amount) {
    const gasPrice = await this.getGasPrice(1);
    console.log('%%% gas price', gasPrice)
    const transactionFunc = this.contract.methods[method](...params);
    console.log('---amount', parseInt(amount))
    const estimateGas = await transactionFunc.estimateGas({
      from: fromAddress,
      value: amount ? parseInt(amount) : 0
    })
    console.log('[[est gas]]', estimateGas)
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
      console.log('<gasPrice>', gasPrice)
      let valuePriority = 1;
      switch (priority) {
        case 0:
          valuePriority = 0.75;
          break;
        case 2:
          valuePriority = 1.25;
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
}