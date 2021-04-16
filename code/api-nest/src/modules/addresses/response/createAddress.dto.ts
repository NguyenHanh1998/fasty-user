import { ApiProperty } from '@nestjs/swagger';
import { add } from 'lodash';
import { Address } from 'src/database/entities';

export class CreateAddress {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  walletId: number;

  @ApiProperty({
    type: String,
    example: 'eth',
  })
  currency: string;

  @ApiProperty({
    type: String,
    example: '0x99c4efe10892b960C37DfB3AB1E0459e926F7F37',
  })
  address: string;

  constructor(address: Address) {
    this.walletId = address.walletId;
    this.currency = address.currency;
    this.address = address.address;
  }
}
