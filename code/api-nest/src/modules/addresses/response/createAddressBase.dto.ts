import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/response/baseResponse.dto';
import { CreateAddress } from './createAddress.dto';

export class CreateAddressBase extends BaseResponse {
  @ApiProperty({
    type: CreateAddress,
  })
  data: CreateAddress;
}
