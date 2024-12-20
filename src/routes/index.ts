import { Request, Response, Router } from "express";

const router = Router();

// return 'Ok' for base route
router.get("/", (_req: Request, res: Response) => { res.send("Ok");})

export default router;