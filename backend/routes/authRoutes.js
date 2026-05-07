import express from 'express';
const router = express.Router();
import { register, login, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
