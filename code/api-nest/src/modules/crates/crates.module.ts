import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crate } from 'src/database/entities';
import { CratesController } from './crates.controller';
import { CratesService } from './crates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Crate])],
  controllers: [CratesController],
  providers: [CratesService],
})
export class CratesModule {}
