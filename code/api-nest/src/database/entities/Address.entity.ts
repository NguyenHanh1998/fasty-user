import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';
// import Kms from '../encrypt/Kms';

@Entity('address')
@Index('wallet_id', ['walletId'], { unique: false })
export class Address {
  @Column({ name: 'wallet_id', type: 'int', nullable: false })
  public walletId: number;

  @Column({ name: 'currency', type: 'varchar', length: 200, nullable: false })
  public currency: string;

  @PrimaryColumn({ name: 'address', type: 'varchar', length: 150 })
  public address: string;

  @Column({ name: 'is_external', type: 'tinyint', width: 1, nullable: false, default: 0 })
  public isExternal: boolean;

  @Column({ name: 'is_hd', type: 'tinyint', width: 1, nullable: false, default: 0 })
  public isHd: boolean;

  @Column({ name: 'hd_path', type: 'varchar', length: 100, nullable: true })
  public hdPath: string;

  @Column('text', { name: 'secret', nullable: false })
  public secret: string;

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
