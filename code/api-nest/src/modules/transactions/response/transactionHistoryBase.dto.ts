import { ApiProperty } from '@nestjs/swagger';

import { BaseResponsePagination } from '../../../shared/response/baseResponse.dto';
import { TransactionHistory } from './transactionHistory.dto';
export class TransactionHistoryBase extends BaseResponsePagination {
  @ApiProperty({
    type: TransactionHistory,
    isArray: true,
  })
  public data: Array<TransactionHistory>;
}
