import { ApiProperty } from '@nestjs/swagger';
import { BaseResponsePagination } from 'src/shared/response/baseResponse.dto';
import { ProductDetails } from './productDetails.dto';

export class ProductsBase extends BaseResponsePagination {
  @ApiProperty({
    type: ProductDetails,
    isArray: true,
  })
  data: Array<ProductDetails>;
}
