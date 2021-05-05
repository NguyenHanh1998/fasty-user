import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from '../../../shared/response/baseResponse.dto';
import { TransactionDetails } from './transactionDetails.dto';

export class TransactionDetailsBase extends BaseResponse {
  @ApiProperty({
    type: TransactionDetails,
  })
  public data: TransactionDetails;
}
