import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('crate')
export class Crate {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: false })
  description: string;

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
