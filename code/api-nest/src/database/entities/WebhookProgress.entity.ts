import { Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Column, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('webhook_progress')
@Index('webhook_id', ['webhookId'], { unique: false })
@Index('ref_id', ['refId'], { unique: false })
export class WebhookProgress {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'webhook_id', type: 'int', nullable: false })
  public webhookId: number;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  public type: string;

  @Column({ name: 'ref_id', type: 'int', nullable: false })
  public refId: number;

  @Column({ name: 'event', type: 'varchar', nullable: false })
  public event: string;

  @Column({ name: 'is_processed', type: 'tinyint', width: 1, nullable: false, default: false })
  public isProcessed: boolean;

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
