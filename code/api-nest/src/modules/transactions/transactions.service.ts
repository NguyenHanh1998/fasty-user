import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { checkIPaginationOptions } from 'src/shared/Utils';
import { TransactionHistory } from './response/transactionHistory.dto';
import { Causes as InternalException } from '../../config/exception/causes';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, Order, OrderTx, Product, User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { TransactionDetails } from './response/transactionDetails.dto';
import { OrderTxStatus, OrderTxType } from 'src/shared/enums';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(OrderTx)
    private readonly orderTxsRepository: Repository<OrderTx>,
  ) {}

  async getUserTransactionHistory(
    user: User,
    paginateOptions: IPaginationOptions,
  ): Promise<PaginationResponse<TransactionHistory>> {
    if (!checkIPaginationOptions(paginateOptions)) {
      throw InternalException.IPAGINATION_OPTIONS_INVALID;
    }

    // for (let i in searchOptions) {
    //   if (!searchOptions[i]) {
    //     searchOptions[i] = null;
    //   }
    // }

    // get user address
    const addressRecord = await this.addressesRepository.findOne({
      userId: user.id,
    });

    if (!addressRecord) {
      throw InternalException.ADDRESS_OF_USER_NOT_FOUND;
    }

    const userAddress = addressRecord.address;
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndMapOne('order.product', Product, 'product', 'order.product_id = product.id')
      .where('order.buyer_address = :address', { address: userAddress });

    const response = await paginate<Order>(queryBuilder, paginateOptions);
    const results = await Promise.all(
      response.items.map(async (result: any) => {
        result.productName = result.product.name;
        result.price = result.product.price;
        result.gender = result.product.gender;
        result.type = result.product.type;
        result.description = result.product.description;
        result.image = result.product.image;
        result.status = result.product.status;
        return new TransactionHistory(result);
      }),
    );

    return {
      results,
      pagination: response.meta,
    };
  }

  async getTransactionDetails(orderId: string): Promise<TransactionDetails> {
    const order = await this.ordersRepository.findOne({ id: orderId });

    if (!order) {
      throw InternalException.ORDER_NOT_FOUND;
    }
    const transaction: any = order;
    const product = await this.productsRepository.findOne({ id: order.productId });

    transaction.productName = product.name;
    transaction.orderId = order.id;
    transaction.price = order.amount;
    transaction.currency = order.currency;

    const orderTx = await this.orderTxsRepository.findOne({
      orderId: order.id,
      type: OrderTxType.OrderFulfilled,
      status: OrderTxStatus.CONFIRMED,
    });

    transaction.txId = orderTx ? orderTx.txid : null;

    return new TransactionDetails(transaction);
  }
}
