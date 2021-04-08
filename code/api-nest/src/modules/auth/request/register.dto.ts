import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Register {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'gakki',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
