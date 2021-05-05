import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Order, OrderTx, Product } from 'src/database/entities';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, Address, OrderTx])],
  exports: [TypeOrmModule, TransactionsService],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
