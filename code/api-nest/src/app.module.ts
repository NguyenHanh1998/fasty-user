import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
<<<<<<< HEAD
import { ExceptionFilter } from './config/exception/exception.filter';
import { TransformInterceptor } from './config/rest/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CratesModule } from './modules/crates/crates.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ProductsModule } from './modules/products/products.module';
=======
import { AuthModule } from './modules/auth/auth.module';
>>>>>>> feat: update module auth<user>

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
<<<<<<< HEAD
    CratesModule,
    SubscriptionsModule,
    ProductsModule,
=======
>>>>>>> feat: update module auth<user>
  ],
  controllers: [AppController],
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
  ],
})
export class AppModule {}
