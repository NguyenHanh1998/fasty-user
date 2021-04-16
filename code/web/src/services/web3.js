const Web3 = require('web3')
const network = process.env.APP_NETWORK
const networkConfigs = require(`../configs/eth/network/${network}.json`)

const infuraWeb3 = new Web3(
  new Web3.providers.HttpProvider(networkConfigs.provider)
);

module.exports = { infuraWeb3 };