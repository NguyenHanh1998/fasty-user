import {
  User,
  Product,
  Subscription,
  Crate,
  Order,
  OrderPaymentMethod,
  CrawlStatus,
  CurrencyConfig,
  OrderTx,
} from 'src/database/entities';
import { Currency } from 'src/database/entities/Currency.entity';
import { Wallet } from 'src/database/entities/Wallet.entity';
import { WalletBalance } from 'src/database/entities/WalletBalance.entity';
import { WalletLog } from 'src/database/entities/WalletLog.entity';
import { Webhook } from 'src/database/entities/Webhook.entity';
import { WebhookLog } from 'src/database/entities/WebhookLog.entity';
import { WebhookProgress } from 'src/database/entities/WebhookProgress.entity';
import { Withdrawal } from 'src/database/entities/Withdrawal.entity';
import { WithdrawalLog } from 'src/database/entities/WithdrawalLog.entity';
import { WithdrawalTx } from 'src/database/entities/WithdrawalTx.entity';
import { ConnectionOptions } from 'typeorm';

export const databaseConfig: ConnectionOptions = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || '1',
  database: process.env.TYPEORM_DATABASE || 'fasty',
  entities: [
    User,
    Product,
    Subscription,
    Crate,
    Order,
    OrderTx,
    OrderPaymentMethod,
    CrawlStatus,
    CurrencyConfig,
    Currency,
    Wallet,
    WalletBalance,
    WalletLog,
    Webhook,
    WebhookLog,
    WebhookProgress,
    Withdrawal,
    WithdrawalLog,
    WithdrawalTx,
  ],
  synchronize: true,
};
