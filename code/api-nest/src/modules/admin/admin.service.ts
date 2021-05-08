import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvConfig, Order } from 'src/database/entities';
import { getLogger } from 'src/shared/logger';
import { Repository } from 'typeorm';
import { CurrencyRevenue } from './response/currencyRevenue.dto';
import { Causes as InternalException } from '../../config/exception/causes';
import { Currency, OrderStatus } from 'src/shared/enums';
import BigNumber from 'bignumber.js';

const logger = getLogger('AdminService');
const currencies = [Currency.ETH];
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(EnvConfig)
    private envConfigRepository: Repository<EnvConfig>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getTotalRevenue(): Promise<Array<CurrencyRevenue>> {
    const adminAddress = await this.envConfigRepository.findOne('ADMIN_ADDRESS');
    if (!adminAddress) {
      logger.error('Admin address not found in table env_config');
      throw InternalException.ADMIN_ADDRESS_NOT_FOUND;
    }

    const revenue = await this._computeRevenue(adminAddress.value);

    const allRevenue: CurrencyRevenue[] = await Promise.all(
      currencies.map((currency) => {
        const currencyRevenue: CurrencyRevenue = new CurrencyRevenue();
        currencyRevenue.currency = currency;
        currencyRevenue.amount = revenue[currency].amount.toFixed(0).toString();
        return currencyRevenue;
      }),
    );

    return allRevenue;
  }

  async _computeRevenue(address: string): Promise<any> {
    const revenue = await this._revenueObject();
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.seller_address = :address', { address })
      .andWhere('order.status = :status', { status: OrderStatus.FULFILLED })
      .getMany();

    await Promise.all(
      orders.map((order: Order) => {
        revenue[order.currency].amount = revenue[order.currency].amount.plus(order.amount);
      }),
    );

    return revenue;
  }

  private async _revenueObject(): Promise<any> {
    const revenueObject = {};
    await Promise.all(
      currencies.map((currency) => {
        revenueObject[currency] = {
          currency,
          amount: new BigNumber(0),
        };
      }),
    );
    return revenueObject;
  }
}
