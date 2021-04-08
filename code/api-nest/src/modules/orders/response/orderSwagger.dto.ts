import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../../shared/response/baseResponse.dto';
import { OrderResponse } from './order.dto';

export class OrderSwagger extends BaseResponse {
  @ApiProperty({
    type: OrderResponse,
  })
  data: OrderResponse;
}
