import { login, refreshToken, signup } from '../api/auth.api';

import { Router } from 'express';

const router = Router();

// Signup route
router.post('/signup', signup)
// Login route
router.post('/login', login)
// Refresh token route
router.post('/refresh-token', refreshToken)

export default router;