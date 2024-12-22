import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Access token expired', expiredAt: err.expiredAt });
            return;
        }
        res.status(403).json({ message: 'Forbidden', error: err.message });
        return;
    }

    next();
};
