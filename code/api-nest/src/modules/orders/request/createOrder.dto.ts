import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumberString, IsNumber } from 'class-validator';
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
  @IsNumber()
  public productId: number;

  @ApiProperty({
    example: [{ currency: 'eth', amount: '100000000000000000000', isDefault: true }],
  })
  @IsArray()
  @Type(() => PaymentMethods)
  public paymentMethods: PaymentMethods[];
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
