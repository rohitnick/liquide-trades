import { Request, Response } from "express";

import { AppDataSource } from '../data-source';
import { Trade } from '../entities/Trade';
import { fetchTradesFromRedis } from "../services/query.service";
import redis from "../redis";

const tradeRepository = AppDataSource.getRepository(Trade);

// Get all trades or filter by type/user_id
export const getTrades = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type, user_id } = req.query;

        const trades = await fetchTradesFromRedis(type as string, Number(user_id));
        
        res.status(200).json(trades);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get a trade by ID
export const getTradeById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        
        const trade = await redis.get(`trade:${id}`);
        if (!trade) {
          return res.status(404).json({ message: 'Trade not found' });
        }
        
        res.status(200).json(JSON.parse(trade));
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
