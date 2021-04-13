import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('event_log')
@Index('event_log_txid_unique', ['txid'], { unique: true })
@Index('event_log__order_id', ['orderId'])
@Index('event_log_product_id', ['productId'])
@Index('event_log_seller_address', ['sellerAddress'])
@Index('event_log_exchange_address', ['exchangeAddress'])
export class EventLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'txid', type: 'varchar', length: 100, nullable: false, default: '' })
  public txid: string;

  @Column({ name: 'order_id', type: 'varchar', length: 50, nullable: false, default: '' })
  public orderId: string;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  public type: string;

  @Column({ name: 'product_id', type: 'int' })
  public productId: number;

  @Column({ name: 'seller_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public sellerAddress: string;

  @Column({ name: 'exchange_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public exchangeAddress: string;

  @Column({ name: 'currency', type: 'text', nullable: true })
  public currency: string;

  @Column({ name: 'amount', type: 'text', nullable: true })
  public amount: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
    this.updatedAt = nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}
