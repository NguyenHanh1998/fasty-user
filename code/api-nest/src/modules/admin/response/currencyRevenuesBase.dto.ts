import { ApiProperty } from '@nestjs/swagger';

import { CurrencyRevenue } from './currencyRevenue.dto';
export class CurrencyRevenuesBase {
  @ApiProperty({
    type: CurrencyRevenue,
    isArray: true,
  })
  public data: Array<CurrencyRevenue>;
}
