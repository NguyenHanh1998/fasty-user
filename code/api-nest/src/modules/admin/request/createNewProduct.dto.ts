import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateNewProduct {
  @ApiProperty({
    type: String,
    example: 'clothes',
  })
  @IsString()
  public productName: string;

  @ApiProperty({
    type: String,
    example: 'A monthly supply of trendy clothes for men.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  type: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber()
  gender: number;

  @ApiProperty({
    type: String,
    example: '111000000000000000000',
  })
  @IsString()
  public price: string;

  @ApiProperty({
    type: String,
    example: '/images/stock/belt-female.jpg',
  })
  @IsString()
  image: string;

  @ApiProperty({
    type: String,
    example: 'eth',
  })
  @IsString()
  public currency: string;
}
