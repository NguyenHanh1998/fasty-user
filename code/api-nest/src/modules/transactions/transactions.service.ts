import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { checkIPaginationOptions } from 'src/shared/Utils';
import { TransactionHistory } from './response/transactionHistory.dto';
import { Causes as InternalException } from '../../config/exception/causes';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, Order, Product, User } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
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
        return new TransactionHistory(result);
      }),
    );

    return {
      results,
      pagination: response.meta,
    };
  }
}
