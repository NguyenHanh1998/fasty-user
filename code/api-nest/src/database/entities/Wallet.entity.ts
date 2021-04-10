import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('wallet')
@Index('user_id', ['userId'], { unique: false })
export class Wallet {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  public userId: number;

  @Column({ name: 'label', type: 'varchar', nullable: false })
  public label: string;

  @Column({ name: 'currency', type: 'varchar', nullable: false })
  public currency: string;

  @Column({
    name: 'withdrawal_mode',
    type: 'varchar',
    length: 90,
    nullable: false,
    default: 'normal',
  })
  public withdrawalMode: string;

  @Column('text', { name: 'secret', nullable: true })
  public secret: string;

  @Column({ name: 'is_hd', type: 'tinyint', width: 1, nullable: true, default: false })
  public isHd: boolean;

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
