import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderTx, OrderPaymentMethod } from '../../database/entities';
// import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderTx, OrderPaymentMethod])],
  exports: [TypeOrmModule, OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
