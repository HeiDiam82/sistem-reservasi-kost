import { Router } from 'express';
const router = Router();
import { register, login, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
