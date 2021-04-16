import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Wallet } from 'src/database/entities';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Wallet])],
  providers: [AddressesService],
  controllers: [AddressesController],
})
export class AddressesModule {}
