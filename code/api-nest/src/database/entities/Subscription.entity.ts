import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('subscription')
@Index('user_id', ['userId'], { unique: false })
@Index('crate_id', ['crateId'], { unique: false })
export class Subscription {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'crate_id', type: 'int', nullable: false })
  crateId: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  updatedAt: number;

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
