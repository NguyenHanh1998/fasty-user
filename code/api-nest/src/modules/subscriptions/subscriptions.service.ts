import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Causes } from 'src/config/exception/causes';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { Crate, Subscription, User } from 'src/database/entities';
import { getLogger } from 'src/shared/logger';
import { getArrayPagination } from 'src/shared/Utils';
import { Repository } from 'typeorm';
import { SubscriptionDetails } from './response/subscriptionDetails.dto';

const logger = getLogger('SubscriptionsService');
@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Crate)
    private cratesRepository: Repository<Crate>,
  ) {}

  async getAllSubscriptions(
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponse<SubscriptionDetails>> {
    const subscriptions = await this.subscriptionsRepository.find();
    const { items, meta } = getArrayPagination(subscriptions, paginationOptions);

    const results: SubscriptionDetails[] = await this.getSubscriptionsInfo(items);
    return {
      results: results,
      pagination: meta,
    };
  }

  async getSubscriptionDetails(subscriptionId: number): Promise<SubscriptionDetails> {
    const subscription = await this.subscriptionsRepository.findOne({ id: subscriptionId });

    if (!subscription) {
      logger.error(`Subscription ${subscriptionId} not found`);
      throw Causes.SUBSCRIPTION_NOT_FOUND;
    }
    const listSubsciptions: Array<Subscription> = [];
    listSubsciptions.push(subscription);

    const result = await this.getSubscriptionsInfo(listSubsciptions);
    return new SubscriptionDetails(result[0]);
  }

  async getSubscriptionsInfo(subscriptions: any): Promise<Array<SubscriptionDetails>> {
    const response: SubscriptionDetails[] = await Promise.all(
      subscriptions.map(async (subscription: Subscription) => {
        const response: any = subscription;
        const user = await this.usersRepository.findOne({
          id: subscription.userId,
        });
        const crate = await this.cratesRepository.findOne({
          id: subscription.crateId,
        });
        response.user = user;
        response.crate = crate;

        return new SubscriptionDetails(response);
      }),
    );

    return response;
  }
}
