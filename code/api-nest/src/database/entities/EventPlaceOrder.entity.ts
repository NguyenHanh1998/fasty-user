import { nowInMillis } from 'src/shared/Utils';
import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('event_place_order')
@Index('event_place_order_txid', ['txid'], { unique: true })
@Index('event_place_order_order_id', ['orderId'])
@Index('event_place_order_product_id', ['productId'])
@Index('event_place_order_seller_address', ['sellerAddress'])
@Index('event_place_order_exchange_address', ['exchangeAddress'])
export class EventPlaceOrder {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'txid', type: 'varchar', length: 100, nullable: false })
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
