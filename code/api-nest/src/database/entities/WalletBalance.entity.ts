import { nowInMillis } from '../../shared/Utils';
import { Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('wallet_balance')
@Index('wallet_id', ['walletId'], { unique: false })
@Index('wallet_id_currency_unique', ['walletId', 'currency'], { unique: true })
export class WalletBalance {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  public id: number;

  @Column({ name: 'wallet_id', type: 'int', nullable: false })
  public walletId: number;

  @Column({ name: 'currency', type: 'varchar', length: 190, nullable: false })
  public currency: string;

  @Column({
    name: 'balance',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
    default: '0',
  })
  public balance: string;

  @Column({
    name: 'withdrawal_pending',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
    default: '0',
  })
  public withdrawalPending: string;

  @Column({
    name: 'withdrawal_total',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
    default: '0',
  })
  public withdrawalTotal: string;

  @Column({
    name: 'deposit_total',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
    default: '0',
  })
  public depositTotal: string;

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
