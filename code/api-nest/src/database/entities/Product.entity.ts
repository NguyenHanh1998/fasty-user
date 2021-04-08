import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 191, nullable: false, unique: true })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ name: 'type', type: 'int', nullable: false })
  type: number;

  @Column({ name: 'gender', type: 'int', nullable: false })
  gender: number;

  @Column({ name: 'status', type: 'varchar', length: 30, default: null })
  public status: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 50,
    scale: 0,
    default: null,
  })
  public price: string;

  @Column({ name: 'currency', type: 'varchar', length: 100, default: null })
  public currency: string;

  @Column({ name: 'current_owner', type: 'varchar', length: 100, default: null })
  public currentOwner: string;

  @Column({ name: 'image', type: 'varchar', length: 255, nullable: false })
  image: string;

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
