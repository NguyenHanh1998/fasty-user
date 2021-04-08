import { User, Product, Subscription, Crate } from 'src/database/entities';
import { ConnectionOptions } from 'typeorm';

export const databaseConfig: ConnectionOptions = {
  type: (process.env.TYPEORM_CONNECTION || 'mysql') as any,
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || '1',
  database: process.env.TYPEORM_DATABASE || 'fasty',
  entities: [User, Product, Subscription, Crate],
  synchronize: true,
};
