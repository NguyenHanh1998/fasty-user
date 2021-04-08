import { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryColumn, Index } from 'typeorm';

import { nowInMillis } from '../../shared/Utils';

@Entity('order')
@Index('order_product_id', ['productId'])
@Index('order_buyer_address', ['buyerAddress'])
@Index('order_seller_address', ['sellerAddress'])
@Index('order_exchange_address', ['exchangeAddress'])
@Index('order_status', ['status'])
export class Order {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50, nullable: false, default: '' })
  public id: string;

  @Column({ name: 'product_id', type: 'int' })
  public productId: number;

  @Column({ name: 'buyer_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public buyerAddress: string;

  @Column({ name: 'seller_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public sellerAddress: string;

  @Column({ name: 'exchange_address', type: 'varchar', length: 100, nullable: false, default: '' })
  public exchangeAddress: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 50,
    scale: 0,
    nullable: true,
  })
  public amount: string;

  @Column({ name: 'currency', type: 'varchar', length: 100, nullable: true })
  public currency: string;

  @Column({ name: 'status', type: 'varchar', length: 30, nullable: false, default: '' })
  public status: string;

  @Column({ name: 'txid_taken', type: 'varchar', length: 100, nullable: true })
  public txidTaken: string;

  @Column({ name: 'exchange_rate', type: 'varchar', nullable: true })
  public exchangeRate: string;

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
