import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { Trade } from './Trade';
import bcrypt from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    password: string;
    @MinLength(8)
    @OneToMany(() => Trade, (trade) => trade.user)
    trades: Trade[];

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
}
