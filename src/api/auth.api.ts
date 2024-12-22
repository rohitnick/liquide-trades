import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../utils/constants";
import { Request, Response } from "express";

import { AppDataSource } from '../data-source';
import { User } from "../entities/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from "../redis";

const userRepository = AppDataSource.getRepository(User);

// Generate JWT tokens
const generateAccessToken = (user: { id: number; email: string }) => {
    return jwt.sign(user, process.env.JWT_SECRET || 'supersecretkey', {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

const generateRefreshToken = async (user: { id: number; email: string }) => {
    const refreshToken = jwt.sign(user, process.env.JWT_SECRET || 'supersecretkey', {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
    await redis.set(`refresh_token:${refreshToken}`, user.id, 'EX', REFRESH_TOKEN_EXPIRY);
    return refreshToken;
};

export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        
        const user = userRepository.create({ email, password });
        await userRepository.save(user);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = await generateRefreshToken({ id: user.id, email: user.email });

        // Set Authorization headers
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        
        res.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    const userId = await redis.get(`refresh_token:${refreshToken}`);
    if (!userId) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'supersecretkey') as { id: number; email: string };
        
        // Delete the used refresh token
        await redis.del(`refresh_token:${refreshToken}`);
        
        // Generate new access and refresh tokens
        const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
        const newRefreshToken = await generateRefreshToken({ id: decoded.id, email: decoded.email });

        // Set Authorization headers
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
}