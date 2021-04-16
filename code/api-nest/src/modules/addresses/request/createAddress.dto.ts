import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressRequest {
  @ApiProperty({
    type: String,
    example: '2865he3rf3f8udjij283euwid8374298w3eidjs',
  })
  privateKey: string;

  @ApiProperty({
    type: String,
    example: '0x99c4efe10892b960C37DfB3AB1E0459e926F7F37',
  })
  address: string;
}
