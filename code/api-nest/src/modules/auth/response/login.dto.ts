import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/entities';

export class UserDetails {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'hanh',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'ADMIN',
  })
  role: string;

  constructor(user: User) {
    (this.email = user.email), (this.name = user.username), (this.role = user.role);
  }
}

export class LoginResponse {
  @ApiProperty({
    type: UserDetails,
  })
  user: UserDetails;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haW5ndXllbiIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNTg3NzI3NjE0fQ.V0cWJ_82CcakvCHfNbPLORJ6ShkGJyiC2H1jCQ5Z02s',
  })
  token: string;
}
