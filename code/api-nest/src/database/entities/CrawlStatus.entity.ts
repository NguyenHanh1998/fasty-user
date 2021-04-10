import { nowInMillis } from '../../shared/Utils';
import { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crawl_status')
export class CrawlStatus {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  public id: number;

  @Column({ name: 'contract_name', type: 'varchar', nullable: false })
  public contractName: string;

  @Column({ name: 'contract_address', type: 'varchar', nullable: false })
  public contractAddress: string;

  @Column({ name: 'block_number', type: 'int', unsigned: true, nullable: false })
  public blockNumber: number;

  @Column({ name: 'created_at', type: 'bigint', unsigned: true, nullable: true })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', unsigned: true, nullable: true })
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
