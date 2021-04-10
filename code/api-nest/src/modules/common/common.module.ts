import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { CurrencyRegistryService } from './currency.service';
// import { BlockchainService } from './blockchain.service';
// import { ContractService } from './contract.service';
// import { KmsService } from './kms.service';
import { Web3Mixin } from './Web3Mixin.service';
import { CurrencyConfig, CrawlStatus } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyConfig, CrawlStatus]), HttpModule],
  exports: [TypeOrmModule, Web3Mixin],
  providers: [Web3Mixin],
})
export class CommonModule {}
