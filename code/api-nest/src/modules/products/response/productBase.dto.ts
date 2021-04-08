import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/response/baseResponse.dto';
import { ProductDetails } from './productDetails.dto';

export class ProductBase extends BaseResponse {
  @ApiProperty({
    type: ProductDetails,
  })
  data: ProductDetails;
}
