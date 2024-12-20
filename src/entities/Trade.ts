import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['buy', 'sell'] })
  @Index()
  type: 'buy' | 'sell';

  @Column()
  @Index()
  user_id: number;

  @Column()
  symbol: string;

  @Column({ type: 'int', width: 3 })
  shares: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.trades)
  @JoinColumn({ name: "user_id" })
  user: User;
}
