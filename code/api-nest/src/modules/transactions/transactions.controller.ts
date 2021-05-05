import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { User } from 'src/database/entities';
import { UserDecorator } from 'src/shared/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionDetails } from './response/transactionDetails.dto';
import { TransactionDetailsBase } from './response/transactionDetailsBase.sto';
import { TransactionHistory } from './response/transactionHistory.dto';
import { TransactionHistoryBase } from './response/transactionHistoryBase.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/user')
  @ApiOperation({
    tags: ['transactions'],
    operationId: 'getUserTransactionsHistory',
    summary: 'Get user transaction history',
    description: 'Get user transaction history',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TransactionHistoryBase,
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
  async getUserTransactionHistory(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @UserDecorator() user: User,
  ): Promise<PaginationResponse<TransactionHistory>> {
    return this.transactionsService.getUserTransactionHistory(user, { page, limit });
  }

  @Get('/:order_id')
  @ApiOperation({
    tags: ['transactions'],
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
    return this.transactionsService.getTransactionDetails(orderId);
  }
}
