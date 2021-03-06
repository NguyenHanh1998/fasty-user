import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, EnvConfig, User, Wallet, WalletBalance } from '../../database/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, WalletBalance, Address, EnvConfig]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'abcxyz',
      signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
