import { Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { limits } from 'argon2';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { UserDecorator } from 'src/shared/decorator/user.decorator';
import { EmptyObject } from 'src/shared/response/emptyObject.dto';
import { EmptyObjectBase } from 'src/shared/response/emptyObjectBase.dto';
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
  async getAllSubscriptionsByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
  ): Promise<PaginationResponse<SubscriptionDetails>> {
    return this.subscriptionsService.getAllSubscriptionsByUser({ page, limit }, req.user);
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

  @Post('/remove/:subscription_id')
  @ApiOperation({
    tags: ['subscriptions'],
    operationId: 'removeOneSubscription',
    summary: 'Remove one subscripiton',
    description: 'Remove one subscription',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUccessful',
    type: EmptyObjectBase,
  })
  async removeOneSubscription(
    @Param('subscription_id') subscriptionId: number,
  ): Promise<EmptyObject> {
    await this.subscriptionsService.removeOneSubscripiton(subscriptionId);
    return new EmptyObject();
  }

  @Post('/:crate_id')
  @ApiOperation({
    tags: ['subscriptions'],
    operationId: 'createOneSubscription',
    summary: 'Create one subscription',
    description: 'Create one subscription',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUccessful',
    type: SubscriptionBase,
  })
  async createOneSubscripiton(
    @Param('crate_id') crateId: number,
    @Req() req: any,
  ): Promise<SubscriptionDetails> {
    return this.subscriptionsService.createOneSubscription(crateId, req.user);
  }
}
