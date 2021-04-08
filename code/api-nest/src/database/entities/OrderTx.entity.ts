import { Entity, Column, BeforeInsert, BeforeUpdate, Index, PrimaryGeneratedColumn } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('order_tx')
@Index('order_tx_order_id', ['orderId'])
@Index('order_tx_seller_address', ['sellerAddress'])
@Index('order_tx_buyer_address', ['buyerAddress'])
@Index('order_tx_exchange_address', ['exchangeAddress'])
@Index('order_tx_txid', ['txid'])
export class OrderTx {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'order_id', type: 'varchar', length: 50, nullable: false })
  public orderId: string;

  @Column({ name: 'type', type: 'varchar', length: 190, nullable: false })
  public type: string;

  @Column({ name: 'seller_address', type: 'varchar', length: 100, nullable: true, default: '' })
  public sellerAddress: string;

  @Column({ name: 'buyer_address', type: 'varchar', length: 100, nullable: true, default: '' })
  public buyerAddress: string;

  @Column({ name: 'exchange_address', type: 'varchar', length: 100, nullable: true, default: '' })
  public exchangeAddress: string;

  @Column({ name: 'currency', type: 'varchar', length: 100, nullable: true, default: '' })
  public currency: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 50,
    scale: 0,
    nullable: true,
  })
  public amount: string;

  @Column({ name: 'txid', type: 'varchar', length: 100, nullable: false, default: '' })
  public txid: string;

  @Column({ name: 'status', type: 'varchar', length: 50, nullable: false })
  public status: string;

  @Column({ name: 'ref_txid', type: 'varchar', length: 100, nullable: true })
  public refTxid: string;

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
