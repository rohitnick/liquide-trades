import { createTrade, getTradeById, getTrades, methodNotAllowed } from '../api/trade.api';

import { Router } from 'express';

const router = Router();

router.get('/', getTrades);
router.get('/:id', getTradeById);
router.post('/', createTrade);

router.put('/:id', methodNotAllowed);
router.patch('/:id', methodNotAllowed);
router.delete('/:id', methodNotAllowed);

export default router;