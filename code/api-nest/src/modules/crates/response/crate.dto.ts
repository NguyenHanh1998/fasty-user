import { ApiProperty } from '@nestjs/swagger';
import { Crate } from 'src/database/entities';

export class CrateDetails {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Clothes for men',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'A monthly supply of trendy clothes for men.',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 1587464883336,
  })
  createdAt: number;

  @ApiProperty({
    type: Number,
    example: 1587464883336,
  })
  updatedAt: number;

  constructor(crate: Crate) {
    (this.id = crate.id),
      (this.name = crate.name),
      (this.description = crate.description),
      (this.createdAt = crate.createdAt),
      (this.updatedAt = crate.updatedAt);
  }
}
