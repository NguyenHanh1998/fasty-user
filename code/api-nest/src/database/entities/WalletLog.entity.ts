import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('wallet_log')
@Index('wallet_id', ['walletId'], { unique: false })
@Index('ref_id', ['refId'], { unique: false })
export class WalletLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'wallet_id', type: 'int', nullable: false })
  public walletId: number;

  @Column({ name: 'currency', type: 'varchar', length: 200, nullable: false })
  public currency: string;

  @Column({ name: 'ref_currency', type: 'varchar', length: 200, nullable: false })
  public refCurrency: string;

  @Column({ name: 'event', type: 'varchar', length: 30, nullable: false })
  public event: string;

  @Column({
    name: 'balance_change',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: true,
  })
  public balanceChange: number;

  @Column({ name: 'ref_id', type: 'bigint', nullable: false })
  public refId: string;

  @Column({ name: 'data', type: 'text', nullable: true })
  public data: string;

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
