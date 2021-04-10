import { Entity, PrimaryGeneratedColumn, BeforeInsert, Column, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('withdrawal_log')
@Index('ref_id', ['refId'], { unique: false })
@Index('created_at', ['createdAt'], { unique: false })
export class WithdrawalLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  public id: number;

  @Column('int', { name: 'withdrawal_id', nullable: false })
  public withdrawalId: number;

  @Column('int', { name: 'ref_id', nullable: false })
  public refId: number;

  @Column({ name: 'event', type: 'varchar', nullable: false })
  public event: string;

  @Column('text', { name: 'data', nullable: true })
  public data: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
  }
}
