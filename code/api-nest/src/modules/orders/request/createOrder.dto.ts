import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumberString } from 'class-validator';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrder {
  @ApiProperty({
    type: String,
    example: '129206238658360355907953790814297404213',
  })
  @IsString()
  public orderId: string;

  @ApiProperty({
    type: String,
    example: '0x79c1096f522C6b51e84731ada97B6AB1c0CB6CE6',
  })
  @IsString()
  public exchangeAddress: string;

  @ApiProperty({
    type: String,
    example: '0xdcd34470e8c28ab26ecd5f976ae4df6f43fee08fba3b2ee22d14deb06183e982',
  })
  @IsString()
  public txid: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsString()
  public productId: number;

  @ApiProperty({
    example: [{ currency: 'eth', amount: '100000000000000000000', isDefault: true }],
  })
  @IsArray()
  @Type(() => PaymentMethods)
  public paymentMethods: PaymentMethods[];

  @ApiProperty({
    type: String,
    example:
      'f9018a29843b9aca0083038b809487d484cb57a5e6314346659232d0a2ac141c412680b90124da9403cb0000000000000000000000000000000061623330336639633261386338396465000000000000000000000000ba1a44373d53f8d6db347d0cccc2a5beaf7eb1d5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a9945ecda4e00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000423078333734656664343636666263613766366634396163366538653862323938313136323665313161386362656236303737336636313665323235373534313439350000000000000000000000000000000000000000000000000000000000001ba0d12a5c0135d03904755adae20faaac225a83c6d841eac05fb4a7074a6c7cf401a04731ca4cba5c43baffc19f50114ff54e88d63ffca990ca44071f412ae30c02ac',
  })
  @IsString()
  public rawTx: string;
}

export class PaymentMethods {
  @ApiProperty({
    type: String,
  })
  public currency: string;

  @ApiProperty({
    type: String,
  })
  public amount: string;

  @ApiProperty({
    type: Boolean,
  })
  public isDefault: boolean;
}
