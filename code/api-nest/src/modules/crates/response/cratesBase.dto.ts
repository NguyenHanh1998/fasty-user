import { ApiProperty } from '@nestjs/swagger';
import { BaseResponsePagination } from 'src/shared/response/baseResponse.dto';
import { CrateDetails } from './crate.dto';

export class CratesResponseBase extends BaseResponsePagination {
  @ApiProperty({
    type: CrateDetails,
    isArray: true,
  })
  data: Array<CrateDetails>;
}
