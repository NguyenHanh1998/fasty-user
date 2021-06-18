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
    type: String,
    example: 'A monthly supply of trendy clothes for men.',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  type: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  gender: number;

  @ApiProperty({
    type: String,
    example: '/images/stock/belt-female.jpg',
  })
  image: string;

  @ApiProperty({
    type: String,
    example: 'on_sale',
  })
  public status: string;

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
    this.description = transaction.description;
    this.type = transaction.type;
    this.gender = transaction.gender;
    this.image = transaction.image;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
