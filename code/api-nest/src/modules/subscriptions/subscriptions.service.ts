import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Causes } from 'src/config/exception/causes';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { Crate, Subscription, User } from 'src/database/entities';
import { getLogger } from 'src/shared/logger';
import { EmptyObject } from 'src/shared/response/emptyObject.dto';
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

  async getAllSubscriptionsByUser(
    paginationOptions: IPaginationOptions,
    user: User,
  ): Promise<PaginationResponse<SubscriptionDetails>> {
    const subscriptions = await this.subscriptionsRepository.find({
      userId: user.id,
    });
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

  async removeOneSubscripiton(subscriptionId: number) {
    await this.subscriptionsRepository.delete(subscriptionId);
  }

  async createOneSubscription(crateId: number, user: User): Promise<SubscriptionDetails> {
    //check crate is valid?
    const crate = await this.cratesRepository.findOne(crateId);
    if (!crate) {
      throw Causes.CRATE_INVALID;
    }
    //check subscription with crate id and user existed
    const existedSubscription = await this.subscriptionsRepository.findOne({
      crateId,
      userId: user.id,
    });
    if (existedSubscription) {
      throw Causes.SUBSCRIPTION_WITH_CRATE_EXISTED;
    }

    //insert subscription
    const subscription = new Subscription();
    subscription.crateId = crateId;
    subscription.userId = user.id;
    await this.subscriptionsRepository.save(subscription);

    const listSubsciptions: Array<Subscription> = [];
    listSubsciptions.push(subscription);

    const result = await this.getSubscriptionsInfo(listSubsciptions);
    return new SubscriptionDetails(result[0]);
  }
}
