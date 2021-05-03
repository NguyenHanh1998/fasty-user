import { nowInMillis } from 'src/shared/Utils';
import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('event_take_order')
@Index('event_take_order_txid', ['txid'], { unique: true })
@Index('event_take_order_order_id', ['orderId'])
@Index('event_take_order_product_id', ['productId'])
@Index('event_take_order_buyer_address', ['buyerAddress'])
@Index('event_take_order_exchange_address', ['exchangeAddress'])
export class EventTakeOrder {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'txid', type: 'varchar', length: 100, nullable: false })
  public txid: string;

  @Column({ name: 'order_id', type: 'varchar', length: 50, nullable: false, default: '' })
  public orderId: string;

  @Column({ name: 'product_id', type: 'int' })
  public productId: number;

  @Column({ name: 'buyer_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public buyerAddress: string;

  @Column({ name: 'exchange_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public exchangeAddress: string;

  @Column({ name: 'currency', type: 'varchar', length: 100, nullable: false, default: '' })
  public currency: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 50,
    scale: 0,
    nullable: false,
  })
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
