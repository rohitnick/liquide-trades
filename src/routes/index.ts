import { Request, Response, Router } from "express";

import authRoutes from './auth.route';
import { authenticateToken } from "../middleware/auth.middleware";
import tradeRoutes from './trade.route';

const router = Router();

// return 'Ok' for base route
router.get("/", (_req: Request, res: Response) => { res.send("Ok");})

router.use('/auth', authRoutes);

router.use("/trades", authenticateToken, tradeRoutes);

export default router;