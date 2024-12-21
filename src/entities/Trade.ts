import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsInt, IsNotEmpty, Max, Min, validate } from 'class-validator';

import { User } from './User';
import { throwValidatorError } from '../utils/error';

export enum TradeType { 'buy', 'sell' }
const TradeTypes = Object.values(TradeType)

@Entity()
export class Trade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TradeTypes })
    @Index()
    @IsEnum(TradeTypes, { message: 'type must be either buy or sell' })
    type: TradeType;

    @Column()
    @Index()
    @IsNotEmpty()
    user_id: number;

    @Column()
    @IsNotEmpty()
    symbol: string;

    @Column({ type: 'int', width: 3 })
    @Min(1)
    @Max(100)
    shares: number;

    @Column({ type: 'float' })
    @IsNotEmpty()
    price: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => User, (user) => user.trades)
    @JoinColumn({ name: "user_id" })
    user: User;

    @BeforeInsert()
    _performValidation = async () => {
        const errors = await validate(this);
        console.log(errors)
        if (errors.length > 0) {
            throwValidatorError(this, errors);
        }
    };

    @BeforeInsert()
    formatTimestamp() {
        if (this.timestamp) this.timestamp = new Date(this.timestamp)
    }
}
