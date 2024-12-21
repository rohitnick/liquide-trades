import { Request, Response, Router } from "express";

import tradeRoutes from './trade.route';

const router = Router();

// return 'Ok' for base route
router.get("/", (_req: Request, res: Response) => { res.send("Ok");})

router.use("/trades", tradeRoutes);

export default router;