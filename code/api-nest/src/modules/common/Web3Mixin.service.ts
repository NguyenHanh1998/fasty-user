import Web3 from 'web3';
import { toChecksumAddress } from 'web3-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contract } from '../../shared/enums';
import { Causes as InternalException } from '../../config/exception/causes';
import { CurrencyConfig, CrawlStatus } from '../../database/entities';
import { Currency } from '../../shared/enums';
import axios from 'axios';
const networkConfigs = require(`../../config/contract/${process.env.NODE_ENV}`);

const ContractConfigs = networkConfigs.contracts[Contract.FASTY_TOKEN];
const { abi: ContractAbi } = ContractConfigs.CONTRACT_DATA;
// const ContractAddress = ContractConfigs.CONTRACT_ADDRESS;

export class Web3MixinError extends Error {
  public code: number;
  public detail: string;

  constructor(code: number, msg: string, detail: any) {
    super(msg);
    this.name = 'Web3MixinError';
    this.code = code;
    this.detail = detail;
  }
}

// Private funcs use prefix '__' in order to prevent conflict with base class
export class Web3Mixin {
  constructor(
    @InjectRepository(CrawlStatus)
    private crawlStatusRepository: Repository<CrawlStatus>,

    @InjectRepository(CurrencyConfig)
    private currencyConfigRepository: Repository<CurrencyConfig>,
  ) {}

  __getWeb3InstanceWithHttp(restEndpoint: string) {
    const endpoint = restEndpoint ? restEndpoint : networkConfigs.WEB3_API_URL;
    return new Web3(endpoint);
  }

  __getContractInstance(web3Instance: any, contractName: string) {
    return new web3Instance.eth.Contract(ContractAbi, contractName);
  }

  // export function __buildErr(code: number, msg: string, detail: any) {
  //   return new Web3MixinError(code, msg && msg.split('\n')[0], detail);
  // }

  // export function __buildTxErr(err: any) {
  //   return __buildErr(Web3Error.CANNOT_MAKE_TRANSACTION, err.message, err);
  // }

  async readContract(methodName: string, methodArgs: any): Promise<any> {
    const contractName = await this.getContractAddress();
    const restEndpoint: string = await this.getRestEndpoint();
    const response = await this.__getContractInstance(
      this.__getWeb3InstanceWithHttp(restEndpoint),
      contractName,
    )
      .methods[methodName](...methodArgs)
      .call();
    return response;
  }

  async getTransactionByHash(txid: string) {
    const restEndpoint: string = await this.getRestEndpoint();
    const result = await axios.post(
      restEndpoint,
      {
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txid],
        id: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return result;
  }

  async getContractAddress(): Promise<string> {
    const crawl = await this.crawlStatusRepository.findOne({
      contractName: Contract.FASTY_TOKEN,
    });
    if (!crawl) {
      throw InternalException.CAN_NOT_FOUND_ANY_CRAWL_STATUS_RECORD;
    }
    return toChecksumAddress(crawl.contractAddress);
  }

  async getRestEndpoint() {
    const currencyConfig: CurrencyConfig = await this.currencyConfigRepository.findOne({
      currency: Currency.ETH,
    });
    if (!currencyConfig) {
      throw InternalException.ADMIN_CURRENCY_NOT_FOUND;
    }
    const restEndpoint = currencyConfig.restEndpoint;
    return restEndpoint ? restEndpoint : null;
  }
}
