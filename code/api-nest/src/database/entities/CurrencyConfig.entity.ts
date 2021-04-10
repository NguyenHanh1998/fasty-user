import { Entity, BeforeInsert, BeforeUpdate, Column, PrimaryColumn } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('currency_config')
export class CurrencyConfig {
  @PrimaryColumn({ name: 'currency', type: 'varchar', length: 190, nullable: false })
  public currency: string;

  @Column({ name: 'network', type: 'varchar', nullable: false })
  public network: string;

  @Column({ name: 'chain_id', type: 'varchar', nullable: true })
  public chainId: string;

  @Column({ name: 'chain_name', type: 'varchar', nullable: true })
  public chainName: string;

  @Column('int', { name: 'average_block_time', nullable: false })
  public averageBlockTime: number;

  @Column('int', { name: 'required_confirmations', nullable: false })
  public requiredConfirmations: number;

  @Column({ name: 'internal_endpoint', type: 'varchar', nullable: false })
  public internalEndpoint: string;

  @Column({ name: 'rpc_endpoint', type: 'varchar', nullable: true })
  public rpcEndpoint: string;

  @Column({ name: 'rest_endpoint', type: 'varchar', nullable: true })
  public restEndpoint: string;

  @Column({ name: 'explorer_endpoint', type: 'varchar', nullable: true })
  public explorerEndpoint: string;

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
