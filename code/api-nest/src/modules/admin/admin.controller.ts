import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductBase } from '../products/response/productBase.dto';
import { ProductDetails } from '../products/response/productDetails.dto';
import { TransactionDetails } from '../transactions/response/transactionDetails.dto';
import { TransactionDetailsBase } from '../transactions/response/transactionDetailsBase.sto';
import { TransactionHistory } from '../transactions/response/transactionHistory.dto';
import { TransactionHistoryBase } from '../transactions/response/transactionHistoryBase.dto';
import { AdminService } from './admin.service';
import { CreateNewProduct } from './request/createNewProduct.dto';
import { CurrencyRevenue } from './response/currencyRevenue.dto';
import { CurrencyRevenuesBase } from './response/currencyRevenuesBase.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/product')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'createNewProduct',
    summary: 'Create new product',
    description: 'Create new product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ProductBase,
  })
  async createNewProduct(@Body() data: CreateNewProduct): Promise<ProductDetails> {
    return this.adminService.createNewProduct(data);
  }

  @Get('/transactions/total-revenue')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'getTotalRevenue',
    summary: 'Get total revenue from products trading',
    description: 'Get total revenue from products trading',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CurrencyRevenuesBase,
  })
  async getTotalRevenue(): Promise<Array<CurrencyRevenue>> {
    return this.adminService.getTotalRevenue();
  }

  @Get('/transactions')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'getListTransactionHistory',
    summary: 'Get list of transactions history',
    description: 'Get list of transactions history',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TransactionHistoryBase,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: Number,
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
  @ApiQuery({
    name: 'sort_by',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sort_type',
    required: false,
    type: String,
  })
  async getTransactionHistory(
    @Query('name') name: string,
    @Query('start_date') startDate: number,
    @Query('end_date') endDate: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort_by') sortBy: string,
    @Query('sort_type') sortType: string,
  ): Promise<PaginationResponse<TransactionHistory>> {
    return this.adminService.getTransactionHistory(
      { name, startDate, endDate, sortBy, sortType },
      { page, limit },
    );
  }

  @Get('/transactions/:order_id')
  @ApiOperation({
    tags: ['admin'],
    operationId: 'getTransactionDetails',
    summary: 'Get transaction details',
    description: 'Get transaction details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TransactionDetailsBase,
  })
  async getTransactionDetails(@Param('order_id') orderId: string): Promise<TransactionDetails> {
    return this.adminService.getTransactionDetails(orderId);
  }
}
