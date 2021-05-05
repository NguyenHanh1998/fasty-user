import { ApiProperty } from '@nestjs/swagger';

export class TransactionHistory {
  @ApiProperty({
    type: String,
    example: '129460535469386645582397207124226106214',
  })
  public id: string;

  @ApiProperty({
    type: String,
    example: 'Belt for women',
  })
  public productName: string;

  @ApiProperty({
    type: String,
    example: '100000000000000000000',
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
  public createdAt: number;

  @ApiProperty({
    type: Number,
    example: 1592281550632,
  })
  public updatedAt: number;

  constructor(transaction: any) {
    this.id = transaction.id;
    this.productName = transaction.productName;
    this.price = transaction.price;
    this.currency = transaction.currency;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
