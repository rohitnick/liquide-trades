import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Trade } from './Trade';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Trade, (trade) => trade.user)
  trades: Trade[];
}
