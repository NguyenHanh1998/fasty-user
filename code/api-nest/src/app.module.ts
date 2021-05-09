import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { ExceptionFilter } from './config/exception/exception.filter';
import { TransformInterceptor } from './config/rest/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CratesModule } from './modules/crates/crates.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AddressesModule } from './modules/addresses/addresses.module';
import { TransactionsService } from './modules/transactions/transactions.service';
import { TransactionsController } from './modules/transactions/transactions.controller';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AdminModule } from './modules/admin/admin.module';
import { FilesModule } from './modules/files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: '/images/stock',
    }),
    FilesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    CratesModule,
    SubscriptionsModule,
    ProductsModule,
    OrdersModule,
    AddressesModule,
    TransactionsModule,
    AdminModule,
  ],
  controllers: [AppController, TransactionsController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    TransactionsService,
  ],
})
export class AppModule {}
