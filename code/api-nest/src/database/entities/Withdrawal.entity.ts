import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';
import { BigNumber } from '../../shared/BigNumber';

@Entity('withdrawal')
@Index('user_id', ['userId'], { unique: false })
@Index('wallet_id', ['walletId'], { unique: false })
@Index('withdrawal_tx_id', ['withdrawalTxId'], { unique: false })
@Index('from_address', ['fromAddress'], { unique: false })
@Index('to_address', ['toAddress'], { unique: false })
export class Withdrawal {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  public id: number;

  @Column('int', { name: 'user_id', nullable: false })
  public userId: number;

  @Column('int', { name: 'wallet_id', nullable: false })
  public walletId: number;

  @Column('varchar', { name: 'currency', nullable: false })
  public currency: string;

  @Column('int', { name: 'withdrawal_tx_id', nullable: false, default: 0 })
  public withdrawalTxId: number;

  @Column('varchar', { length: 100, name: 'txid', nullable: false, default: '' })
  public txid: string;

  @Column('varchar', { length: 100, name: 'from_address', nullable: false, default: '' })
  public fromAddress: string;

  @Column('varchar', { length: 100, name: 'to_address', nullable: false })
  public toAddress: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: false,
  })
  public amount: string;

  @Column('varchar', { length: 20, name: 'status', nullable: false })
  public status: string;

  @Column({ name: 'memo', type: 'varchar', length: 50, nullable: true })
  public memo: string | null; // note if withdrawal is created by machine

  @Column('varchar', { length: 50, name: 'type', nullable: false })
  public type: string;

  // @Column('varchar', { length: 255, name: 'hash_check', nullable: false })
  // public hashCheck: string;

  // @Column('int', { name: 'kms_data_key_id', nullable: true })
  // public kmsDataKeyId: number | null;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  public updatedAt: number;

  public getAmount(): BigNumber {
    return new BigNumber(this.amount);
  }

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
