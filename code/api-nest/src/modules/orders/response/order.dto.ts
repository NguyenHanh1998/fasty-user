import { ApiResponseProperty, ApiProperty } from '@nestjs/swagger';

export class OrderResponse {
  @ApiResponseProperty({
    type: String,
    example: 1,
  })
  id: string;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  productId: number;

  @ApiResponseProperty({
    type: String,
    example: '0xF7cC551106A1f4E2843A3DA0C477B6f77FA4a09d',
  })
  buyerAddress: string;

  @ApiResponseProperty({
    type: String,
    example: '0xF7cC551106A1f4E2843A3DA0C477B6f77FA4a09d',
  })
  sellerAddress: string;

  @ApiResponseProperty({
    type: String,
    example: '0xF7cC551106A1f4E2843A3DA0C477B6f77FA4a09d',
  })
  exchangeAddress: string;

  @ApiResponseProperty({
    type: String,
    example: '100000000000000000000',
  })
  amount: string;

  @ApiResponseProperty({
    type: String,
    example: 'eth',
  })
  currency: string;

  @ApiProperty({
    description: '[onsale, holding, sold]',
    type: String,
    example: 'onsale',
  })
  status: string;

  @ApiResponseProperty({
    type: Number,
    example: 1587464883336,
  })
  createdAt: number;

  @ApiResponseProperty({
    type: Number,
    example: 1587464883336,
  })
  updatedAt: number;

  @ApiResponseProperty({
    type: String,
    example: 'Chiba',
  })
  name: string;

  constructor(order: any) {
    this.id = order.id;
    this.productId = order.productId;
    this.buyerAddress = order.buyerAddress;
    this.sellerAddress = order.sellerAddress;
    this.exchangeAddress = order.exchangeAddress;
    this.amount = order.amount;
    this.currency = order.currency;
    this.status = order.status;
    this.name = order.name;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}
