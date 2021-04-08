import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/response/baseResponse.dto';
import { CrateDetails } from './crate.dto';

export class CrateResponseBase extends BaseResponse {
  @ApiProperty({
    type: CrateDetails,
  })
  data: CrateDetails;
}
