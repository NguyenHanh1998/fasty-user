import { Entity, PrimaryGeneratedColumn, BeforeInsert, Column, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('webhook_log')
@Index('webhook_progress_id', ['progressId'], { unique: false })
export class WebhookLog {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'webhook_progress_id', type: 'int', nullable: false })
  public progressId: number;

  @Column({ name: 'url', type: 'varchar', nullable: false })
  public url: string;

  @Column('text', { name: 'params', nullable: true })
  public params: string;

  @Column('int', { name: 'status', nullable: false })
  public status: number;

  @Column('text', { name: 'msg', nullable: true })
  public msg: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
  }
}
