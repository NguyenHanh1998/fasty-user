import { Entity, Column, BeforeInsert, BeforeUpdate, Index, PrimaryGeneratedColumn } from 'typeorm';

import { nowInMillis } from '../../shared/Utils';

@Entity('order_payment_method')
@Index('order_payment_method_order_id', ['orderId'])
export class OrderPaymentMethod {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: string;

  @Column({ name: 'order_id', type: 'varchar', length: 50, nullable: false, default: '' })
  public orderId: string;

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

  @Column({ name: 'is_default', type: 'tinyint', width: 1, nullable: false, default: 0 })
  public isDefault: boolean;

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
