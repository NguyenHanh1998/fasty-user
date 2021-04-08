import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { limits } from 'argon2';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionBase } from './response/subscriptionBase.dto';
import { SubscriptionDetails } from './response/subscriptionDetails.dto';
import { SubscriptionsBase } from './response/subscriptionsBase.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({
    tags: ['subscriptions'],
    operationId: 'getAllSubscriptions',
    summary: 'Get all subscriptions',
    description: 'Get all subscriptions',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SubscriptionsBase,
  })
  async getAllSubscriptions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<SubscriptionDetails>> {
    return this.subscriptionsService.getAllSubscriptions({ page, limit });
  }

  @Get('/:subscription_id')
  @ApiOperation({
    tags: ['subscriptions'],
    operationId: 'getSubscriptionDetails',
    summary: 'Get one subscription details',
    description: 'Get one subscription details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUccessful',
    type: SubscriptionBase,
  })
  async getSubscriptionDetails(
    @Param('subscription_id') subscriptionId: number,
  ): Promise<SubscriptionDetails> {
    return this.subscriptionsService.getSubscriptionDetails(subscriptionId);
  }
}
