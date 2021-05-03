import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('event_log')
@Index('event_log_txid_unique', ['txid'], { unique: true })
@Index('event_log_ref_id', ['refId'])
export class EventLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'txid', type: 'varchar', length: 100, nullable: false, default: '' })
  public txid: string;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  public type: string;

  @Column({ name: 'ref_id', type: 'int', nullable: false })
  public refId: number;

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
