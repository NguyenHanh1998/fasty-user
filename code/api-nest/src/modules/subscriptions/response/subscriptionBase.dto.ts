import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/response/baseResponse.dto';
import { SubscriptionDetails } from './subscriptionDetails.dto';

export class SubscriptionBase extends BaseResponse {
  @ApiProperty({
    type: SubscriptionDetails,
  })
  data: SubscriptionDetails;
}
