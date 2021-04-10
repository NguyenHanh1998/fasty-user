import { Index, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('withdrawal_tx')
@Index('user_id', ['userId'], { unique: false })
@Index('wallet_id', ['walletId'], { unique: false })
@Index('hot_wallet_address', ['hotWalletAddress'], { unique: false })
@Index('unsigned_txid_unique', ['unsignedTxid'], {
  unique: true,
})
@Index('txid_unique', ['txid'], { unique: true })
@Index('created_at', ['createdAt'], { unique: false })
@Index('updated_at', ['updatedAt'], { unique: false })
export class WithdrawalTx {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  public id: number;

  @Column('int', { name: 'user_id', nullable: false })
  public userId: number;

  @Column('int', { name: 'wallet_id', nullable: false })
  public walletId: number;

  @Column('varchar', { name: 'hot_wallet_address', nullable: false })
  public hotWalletAddress: string;

  @Column('varchar', { length: 100, name: 'txid', nullable: true, unique: true })
  public txid: string | null;

  @Column('varchar', { length: 200, name: 'currency', nullable: false })
  public currency: string;

  @Column('varchar', { length: 20, name: 'status', nullable: false })
  public status: string;

  @Column('varchar', { length: 100, name: 'unsigned_txid', nullable: false, unique: true })
  public unsignedTxid: string;

  @Column({ name: 'block_number', type: 'int', nullable: true })
  public blockNumber: number;

  @Column({ name: 'block_hash', type: 'varchar', length: 100, nullable: true })
  public blockHash: string;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  public blockTimestamp: number;

  @Column({
    name: 'fee_amount',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: true,
  })
  public feeAmount: string;

  @Column({ name: 'fee_currency', type: 'varchar', length: 200, nullable: true })
  public feeCurrency: string;

  @Column('text', { name: 'unsigned_raw', nullable: true })
  public unsignedRaw: string | null;

  @Column('text', { name: 'signed_raw', nullable: true })
  public signedRaw: string | null;

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
