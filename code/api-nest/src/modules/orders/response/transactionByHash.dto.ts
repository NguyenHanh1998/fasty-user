import { ApiProperty } from '@nestjs/swagger';

export class TransactionByHash {
  @ApiProperty({
    type: String,
    example: '0x99c4efe10892b960c37dfb3ab1e0459e926f7f37',
  })
  from: string;

  @ApiProperty({
    type: String,
    example: '0x2468b3858e6d9b44dda06639b8b1780663d88dc2',
  })
  to: string;

  constructor(trans: any) {
    this.from = trans.from;
    this.to = trans.to;
  }
}
