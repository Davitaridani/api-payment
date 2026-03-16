import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class TransactionBackup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  reff: string;

  @Column({ type: 'bigint' })x
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  backed_up_at: Date;
}
