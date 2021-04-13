import { ApiProperty } from '@nestjs/swagger';
import { UserDetails } from 'src/modules/auth/response/login.dto';
import { CrateDetails } from 'src/modules/crates/response/crate.dto';

export class SubscriptionDetails {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: UserDetails,
  })
  user: UserDetails;

  @ApiProperty({
    type: CrateDetails,
  })
  crate: CrateDetails;

  constructor(subscripiton: any) {
    (this.id = subscripiton.id), (this.user = subscripiton.user), (this.crate = subscripiton.crate);
  }
}
