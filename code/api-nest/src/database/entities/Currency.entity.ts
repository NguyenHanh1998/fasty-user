import { Entity, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('currency')
@Index('user_id', ['userId'], { unique: false })
@Index('wallet_id', ['walletId'], { unique: false })
export class Currency {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  public id: number;

  @Column('int', { name: 'user_id', nullable: false })
  public userId: number;

  @Column('int', { name: 'wallet_id', nullable: false })
  public walletId: number;

  @Column({ name: 'symbol', type: 'varchar', length: 100, nullable: false })
  public symbol: string;

  @Column({
    name: 'withdrawal_mode',
    type: 'varchar',
    length: 90,
    nullable: false,
    default: 'normal',
  })
  public withdrawalMode: string;

  @Column({
    name: 'minimum_withdrawal',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
  })
  public minimumWithdrawal: string;

  @Column({
    name: 'minimum_collect_amount',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
  })
  public minimumCollectAmount: string;

  @Column({
    name: 'lower_threshold',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
  })
  public lowerThreshold: string;

  @Column({
    name: 'upper_threshold',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
  })
  public upperThreshold: string;

  @Column({
    name: 'middle_threshold',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: true,
  })
  public middleThreshold: string;

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
