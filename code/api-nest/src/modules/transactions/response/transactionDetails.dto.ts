import { ApiProperty } from '@nestjs/swagger';

export class TransactionDetails {
  @ApiProperty({
    type: String,
    example: '129191509588652849485732449823211480369',
  })
  public orderId: string;

  @ApiProperty({
    type: String,
    example: '0xcbBB2C7A9c51158748d34d7830FBe46CCf554434',
  })
  public buyerAddress: string;

  @ApiProperty({
    type: String,
    example: '0xF7cC551106A1f4E2843A3DA0C477B6f77FA4a09d',
  })
  public sellerAddress: string;

  @ApiProperty({
    type: String,
    example: 'Belt',
  })
  public productName: string;

  @ApiProperty({
    type: String,
    example: '0x329bf3bff1d595d5f8186413cb52e1bd9f160f6d8b1c007966aeba45d4fca6f0',
  })
  public txId: string;

  @ApiProperty({
    type: Number,
    example: 1592281550632,
  })
  public createdAt: number;

  @ApiProperty({
    type: String,
    example: '100000000000000000',
  })
  public price: string;

  @ApiProperty({
    type: String,
    example: 'eth',
  })
  public currency: string;

  @ApiProperty({
    type: Number,
    example: 1592281550632,
  })
  public updatedAt: number;

  constructor(transaction: any) {
    this.orderId = transaction.orderId;
    this.productName = transaction.productName;
    this.buyerAddress = transaction.buyerAddress;
    this.sellerAddress = transaction.sellerAddress;
    this.txId = transaction.txId;
    this.price = transaction.price;
    this.currency = transaction.currency;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
