import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, validate } from 'class-validator';

import { AppDataSource } from '../data-source';
import { Trade } from './Trade';
import bcrypt from 'bcryptjs';
import { throwValidatorError } from '../utils/error';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @OneToMany(() => Trade, (trade) => trade.user)
    trades: Trade[];

    @BeforeInsert()
    _performValidation = async () => {
        const errors = await validate(this);
        if (errors.length > 0) {
            throwValidatorError(this, errors);
        }
    };

    @BeforeInsert()
    hashPassword = async () => {
      this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeInsert()
    checkEmailUniqueness = async () => {
      const existingUser = await AppDataSource.manager.findOneBy(User, { email: this.email });
      if (existingUser) {
          throw new Error('User with same email already exists');
      }
    }
}
