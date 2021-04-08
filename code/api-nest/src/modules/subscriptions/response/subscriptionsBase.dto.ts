import { ApiProperty } from '@nestjs/swagger';
import { BaseResponsePagination } from 'src/shared/response/baseResponse.dto';
import { SubscriptionDetails } from './subscriptionDetails.dto';

export class SubscriptionsBase extends BaseResponsePagination {
  @ApiProperty({
    type: SubscriptionDetails,
    isArray: true,
  })
  data: SubscriptionDetails;
}
