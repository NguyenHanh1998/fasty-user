import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString } from 'class-validator';

export class TakeOrderTxRequest {
  @ApiProperty({
    type: String,
    example: '129206238658360355907953790814297404213',
  })
  @IsNumberString()
  orderId: string;

  @ApiProperty({
    type: String,
    example: '0xf84E6686c3045e6076271F65c7EdDC9e7f2f390e',
  })
  @IsString()
  toAddress: string;

  @ApiProperty({
    type: String,
    example: '1000000000000000000',
  })
  @IsNumberString()
  amount: string;

  @ApiProperty({
    type: String,
    example: 'god',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    type: String,
    example: '0x11c278ea6ab538ff6694792c41920362ea1fbc0c5712ba2939cb2e9745711036',
  })
  @IsString()
  txid: string;

  @ApiProperty({
    type: String,
    example:
      '0100000001c0243169da33d1eaba7616f849c45d57f14ad4a8599b00efaa4ac9babdfc7af9010000006b483045022100f21797af63d10b1f24b72c7bf03092b291904be659c6d08b48fca47cb4aed64502205fbad4fc60a02a3042ae089cd8c4c1eea5ca59f1153db8aa7b514a3bbb3b086901210395f9559a29ffbb56b51cc918ac82895b8f9cb95961ffc5d3a5ac75c9313b9cd8ffffffff0100e1f505000000001976a9141828cc196b8566362bacf580bd77cc4906ea220188ac00000000',
  })
  @IsString()
  rawTx: string;
}
