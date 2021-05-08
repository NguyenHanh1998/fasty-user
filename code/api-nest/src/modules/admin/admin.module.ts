import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig, Order } from 'src/database/entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, EnvConfig])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
