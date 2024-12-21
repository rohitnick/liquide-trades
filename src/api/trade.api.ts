import { Request, Response } from "express";

import { AppDataSource } from '../data-source';
import { Trade } from '../entities/Trade';

const tradeRepository = AppDataSource.getRepository(Trade);

// Get all trades or filter by type/user_id
export const getTrades = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type, user_id } = req.query;
        const where: any = {};
        if (type) where.type = type;
        if (user_id) where.user_id = Number(user_id);
        
        const trades = await tradeRepository.find({ where });
        res.status(200).json(trades);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get a trade by ID
export const getTradeById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        
        const trade = await tradeRepository.findOneBy({ id });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        res.status(200).json(trade);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new trade
export const createTrade = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type, user_id, symbol, shares, price, timestamp } = req.body;
        
        const trade = tradeRepository.create({ type, user_id, symbol, shares, price, timestamp });
        await tradeRepository.save(trade);
        
        res.status(201).json(trade);
    }   catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Reject unsupported methods (PUT, PATCH, DELETE)
export const methodNotAllowed = async (req: Request, res: Response) => {
    res.status(405).json({ message: 'Method not allowed' });
}
