module.exports = {
  WEB3_API_URL: 'http://172.16.1.204:8545',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 4,
  PROVIDER: 'https://rinkeby.infura.io/v3/b578dbea11f7483baec6624311f2e3a0',
  contracts: {
    FastyToken: {
      CONTRACT_DATA: require('./abi/FastyToken.json'),
      // CONTRACT_ADDRESS: '0x2468b3858e6D9B44ddA06639B8b1780663D88dc2',
      FIRST_CRAWL_BLOCK: 6793874,
      BLOCK_NUM_IN_ONE_GO: 5,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true,
    },
  },
};
