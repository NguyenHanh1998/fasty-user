import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CurrencyRevenue {
  @ApiProperty({
    type: String,
    example: 'eth',
  })
  @IsString()
  public currency: string;

  @ApiProperty({
    type: String,
    example: '100000',
  })
  @IsString()
  public amount: string;
}
