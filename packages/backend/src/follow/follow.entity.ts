import { Entity, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('follows')
export class Follow {
  @PrimaryColumn()
  followerId: number;

  @PrimaryColumn()
  followeeId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
