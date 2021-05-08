import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CurrencyRevenue } from './response/currencyRevenue.dto';
import { CurrencyRevenuesBase } from './response/currencyRevenuesBase.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  // @Get('/transactions')
  // @ApiOperation({
  //   tags: ['gk-admin'],
  //   operationId: 'getListTransactionHistory',
  //   summary: 'Get list of transactions history',
  //   description: 'Get list of transactions history',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: TransactionHistorySwagger,
  // })
  // @ApiQuery({
  //   name: 'name',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'transaction_type',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'start_date',
  //   required: false,
  //   type: Number,
  // })
  // @ApiQuery({
  //   name: 'end_date',
  //   required: false,
  //   type: Number,
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
  //   name: 'sort_by',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'sort_type',
  //   required: false,
  //   type: String,
  // })
  // @ApiQuery({
  //   name: 'lang',
  //   required: false,
  //   type: String
  // })
  // async getTransactionHistory(
  //   @Query('name') name: string,
  //   @Query('transaction_type') transactionType: string,
  //   @Query('start_date') startDate: number,
  //   @Query('end_date') endDate: number,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('sort_by') sortBy: string,
  //   @Query('sort_type') sortType: string,
  //   @Query('lang') language: string,
  // ): Promise<PaginationResponse<TransactionHistory>> {
  //   return this.adminService.getTransactionHistory(
  //     { name, transactionType, startDate, endDate, sortBy, sortType, language },
  //     { page, limit }
  //   );
  // }
}
