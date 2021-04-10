import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderTx, OrderPaymentMethod, Product } from '../../database/entities';
import { CommonModule } from '../common/common.module';
// import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, OrderTx, OrderPaymentMethod]), CommonModule],
  exports: [TypeOrmModule, OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
