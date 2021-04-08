import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 80, nullable: false, unique: true })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 191, nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ name: 'role', type: 'varchar', length: 100, nullable: true })
  role: string;

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
