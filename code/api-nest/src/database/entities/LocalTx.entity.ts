import { LocalTxType } from 'src/shared/enums';
import { nowInMillis } from 'src/shared/Utils';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Index } from 'typeorm';

@Entity('local_tx')
@Index('local_tx_block_hash', ['blockHash'], { unique: false })
@Index('local_tx_block_number', ['blockNumber'], { unique: false })
@Index('local_tx_block_timestamp', ['blockTimestamp'], { unique: false })
@Index('local_tx_created_at', ['createdAt'], { unique: false })
@Index('local_tx_from_address', ['fromAddress'], { unique: false })
@Index('local_tx_ref_id', ['refId'], { unique: false })
@Index('local_tx_to_address', ['toAddress'], { unique: false })
@Index('local_tx_txid', ['txid'], { unique: false })
@Index('local_tx_unsigned_txid', ['unsignedTxid'], { unique: false })
@Index('local_tx_updated_at', ['updatedAt'], { unique: false })
@Index('local_tx_user_id', ['userId'], { unique: false })
@Index('local_tx_wallet_id', ['walletId'], { unique: false })
export class LocalTx {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column('int', { name: 'user_id', nullable: false })
  public userId: number;

  @Column('int', { name: 'wallet_id', nullable: false })
  public walletId: number;

  @Column('varchar', { name: 'from_address', nullable: false })
  public fromAddress: string;

  @Column('varchar', { name: 'to_address', nullable: false })
  public toAddress: string;

  @Column('varchar', { name: 'txid', nullable: true })
  public txid: string | null;

  @Column('varchar', { length: 200, name: 'currency', nullable: false })
  public currency: string;

  @Column('varchar', { length: 100, name: 'currency_symbol', nullable: false })
  public currencySymbol: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 40,
    scale: 8,
    nullable: true,
  })
  public amount: string;

  @Column('varchar', { length: 40, name: 'type', nullable: false })
  public type: string;

  @Column('varchar', { length: 200, name: 'ref_currency', nullable: false })
  public refCurrency: string;

  @Column('varchar', { length: 100, name: 'ref_currency_symbol', nullable: false })
  public refCurrencySymbol: string;

  @Column('varchar', { length: 100, name: 'ref_table', nullable: true })
  public refTable: string;

  @Column({
    name: 'ref_id',
    type: 'decimal',
    precision: 50,
    scale: 0,
    nullable: false,
  })
  public refId: number;

  @Column('varchar', { name: 'memo', nullable: true })
  public memo: string | null;

  @Column('varchar', { length: 20, name: 'status', nullable: false })
  public status: string;

  @Column('varchar', { length: 100, name: 'unsigned_txid', nullable: false })
  public unsignedTxid: string;

  @Column({ name: 'block_number', type: 'bigint', nullable: true })
  public blockNumber: number;

  @Column({ name: 'block_hash', type: 'varchar', length: 100, nullable: true })
  public blockHash: string;

  @Column({ name: 'block_timestamp', type: 'bigint', nullable: true })
  public blockTimestamp: number;

  @Column({
    name: 'fee_amount',
    type: 'decimal',
    precision: 58,
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

  public isTemporaryTransaction(): boolean {
    if (!this.txid) {
      return true;
    }

    if (this.txid.startsWith('TMP_')) {
      return true;
    }

    return false;
  }

  public isWithdrawal(): boolean {
    return this.type === LocalTxType.WITHDRAWAL_NORMAL || this.type === LocalTxType.WITHDRAWAL_COLD;
  }

  public isSeedTx(): boolean {
    return this.type === LocalTxType.SEED;
  }

  public isCollectTx(): boolean {
    return this.type === LocalTxType.COLLECT;
  }

  public isWithdrawalCollect(): boolean {
    return this.type === LocalTxType.WITHDRAWAL_COLLECT;
  }
}
