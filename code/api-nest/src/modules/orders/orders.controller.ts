import { Controller, Get, Post, HttpStatus, Param, Query, Req, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersSwagger } from './response/ordersSwagger.dto';
import { OrderSwagger } from './response/orderSwagger.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderResponse } from './response/order.dto';
import { PaginationResponse } from '../../config/rest/paginationResponse';
import { CreateOrder } from './request/createOrder.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { TakeOrderByEth } from './request/takeOrderByEth.dto';
import { CancelOrder } from './request/cancelOrder.dto';
import { UpdateOrder } from './request/updateOrder.dto';

@Controller('orders')
// @UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Get()
  // @ApiOperation({
  //   tags: ['orders'],
  //   operationId: 'getListOrders',
  //   summary: 'Get list of all current orders',
  //   description: 'Get list of all current orders',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: OrdersSwagger,
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  // })
  // @ApiQuery({
  //   name: 'status',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'address',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'key',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'sort_by',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'sort_type',
  //   required: false,
  //   type: String,
  // })
  // async getListOrders(
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 10,
  //   @Query('status') status: string,
  //   @Query('address') address: string,
  //   @Query('key') key: string,
  //   @Query('sort_by') sortby: string,
  //   @Query('sort_type') sortType: string,
  //   @Req() request: any,
  // ): Promise<PaginationResponse<OrderResponse>> {
  //   return await this.ordersService.getListOrders(
  //     { status, key, sortby, sortType },
  //     {
  //       page,
  //       limit,
  //     },
  //   );
  // }

  // @Get('/:id')
  // @ApiOperation({
  //   tags: ['orders'],
  //   operationId: 'getOrderDetails',
  //   summary: 'Get an order details',
  //   description: 'Get an order details',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: OrderSwagger,
  // })
  // async getOrderDetails(@Param('id') id: number): Promise<OrderResponse> {
  //   return await this.ordersService.getOrderDetails(id);
  // }

  @Post('/take_by_eth')
  @ApiOperation({
    tags: ['orders'],
    operationId: 'takeOrderByEth',
    summary: 'Take an order and pay by Eth',
    description: 'Take an order and pay by Eth',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async takeOrderByEth(@Body() data: TakeOrderByEth, @Req() request: any): Promise<EmptyObject> {
    await this.ordersService.takeOrderByEth(data);
    return new EmptyObject();
  }

  @Post('/create')
  @ApiOperation({
    tags: ['orders'],
    operationId: 'createOrder',
    summary: 'Create order',
    description: 'Create order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async createOrder(@Body() data: CreateOrder): Promise<EmptyObject> {
    await this.ordersService.createOrder(data);
    return new EmptyObject();
  }

  @Post('/update')
  @ApiOperation({
    tags: ['orders'],
    operationId: 'updateOrder',
    summary: 'Update order',
    description: 'Update order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async updateOrder(@Body() data: UpdateOrder): Promise<EmptyObject> {
    await this.ordersService.updateOrder(data);
    return new EmptyObject();
  }

  @Post('/cancel')
  @ApiOperation({
    tags: ['orders'],
    operationId: 'cancelOrder',
    summary: 'Cancel order',
    description: 'Cancel order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async cancelOrder(@Body() data: CancelOrder): Promise<EmptyObject> {
    await this.ordersService.cancelOrder(data);
    return new EmptyObject();
  }
}
