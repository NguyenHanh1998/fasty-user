import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvConfig, Order, OrderTx, Product } from 'src/database/entities';
import { getLogger } from 'src/shared/logger';
import { Repository } from 'typeorm';
import { CurrencyRevenue } from './response/currencyRevenue.dto';
import { Causes as InternalException } from '../../config/exception/causes';
import {
  Currency,
  OrderStatus,
  OrderTxStatus,
  OrderTxType,
  ProductStatus,
  SortBy,
  SortType,
} from 'src/shared/enums';
import BigNumber from 'bignumber.js';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { TransactionHistory } from '../transactions/response/transactionHistory.dto';
import { checkIPaginationOptions, slugConverted } from 'src/shared/Utils';
import { TransactionDetails } from '../transactions/response/transactionDetails.dto';
import { CreateNewProduct } from './request/createNewProduct.dto';
import { ProductDetails } from '../products/response/productDetails.dto';

const logger = getLogger('AdminService');
const currencies = [Currency.ETH];
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(EnvConfig)
    private envConfigRepository: Repository<EnvConfig>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(OrderTx)
    private orderTxRepository: Repository<OrderTx>,
  ) {}

  async createNewProduct(data: CreateNewProduct): Promise<ProductDetails> {
    const { name, description, type, gender, image, price, currency } = data;
    const slug = slugConverted(name);
    const status = ProductStatus.OFFSALE;
    const envConfig = await this.envConfigRepository.findOne('ADMIN_ADDRESS');
    if (!envConfig) {
      logger.error('Admin address not found in table env_config');
      throw InternalException.ADMIN_ADDRESS_NOT_FOUND;
    }

    const product = this.productsRepository.create({
      name,
      slug,
      description,
      type,
      gender,
      image,
      price,
      status,
      currency,
      currentOwner: envConfig.value,
    });

    await this.productsRepository.save(product);

    return new ProductDetails(product);
  }

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

  async getTransactionHistory(
    searchOptions: any,
    paginateOptions: IPaginationOptions,
  ): Promise<PaginationResponse<TransactionHistory>> {
    if (!checkIPaginationOptions(paginateOptions)) {
      throw InternalException.IPAGINATION_OPTIONS_INVALID;
    }

    for (const i in searchOptions) {
      if (!searchOptions[i]) {
        searchOptions[i] = null;
      }
    }
    const { name, startDate, endDate, sortBy, sortType } = searchOptions;
    const sort: string = SortBy.UPDATED_AT;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndMapOne('order.product', Product, 'product', 'order.product_id = product.id')
      .where('(:name is null OR product.name LIKE :search)', { name, search: `%${name}%` })
      .andWhere('order.status = :status', { status: OrderStatus.FULFILLED })
      .andWhere('(:startDate is null OR order.updated_at >= :startDate)', { startDate: startDate })
      .andWhere('(:endDate is null OR order.updated_at <= :endDate)', { endDate: endDate })
      .orderBy(`order.${sort}`, sortType === SortType.SortTypeASC ? 'ASC' : 'DESC');

    const response = await paginate<Order>(queryBuilder, paginateOptions);
    const results = await Promise.all(
      response.items.map(async (result: any) => {
        result.productName = result.product.name;
        //revenue
        result.price = new BigNumber(result.amount);
        result.currency = result.currency;
        return new TransactionHistory(result);
      }),
    );

    return {
      results,
      pagination: response.meta,
    };
  }

  async getTransactionDetails(orderId: string): Promise<TransactionDetails> {
    const order: any = await this.orderRepository.findOne({ id: orderId });
    if (!order) {
      throw InternalException.ORDER_NOT_FOUND;
    }

    const product = await this.productsRepository.findOne({ id: order.productId });
    order.productName = product.name;

    order.price = order.amount;
    order.currency = order.currency;
    order.orderId = order.id;
    order.gender = product.gender;
    order.type = product.type;
    order.description = product.description;
    order.image = product.image;
    //txId
    const tx = await this.orderTxRepository.findOne({
      orderId: order.id,
      type: OrderTxType.OrderFulfilled,
      status: OrderTxStatus.CONFIRMED,
    });
    order.txId = tx ? tx.txid : null;
    //inviter

    return new TransactionDetails(order);
  }
}
