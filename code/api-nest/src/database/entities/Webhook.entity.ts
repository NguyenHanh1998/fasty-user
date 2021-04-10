import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('webhook')
@Index('user_id', ['userId'], { unique: false })
export class Webhook {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  public userId: number;

  @Column({ name: 'type', type: 'varchar', length: 20, nullable: false, default: 'common' })
  public type: string;

  @Column({ name: 'url', type: 'varchar', nullable: false })
  public url: string;

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
