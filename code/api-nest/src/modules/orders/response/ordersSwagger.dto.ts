import { BaseResponsePagination } from '../../../shared/response/baseResponse.dto';
import { OrderResponse } from './order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrdersSwagger extends BaseResponsePagination {
  @ApiProperty({
    type: OrderResponse,
    isArray: true,
  })
  data: Array<OrderResponse>;
}
