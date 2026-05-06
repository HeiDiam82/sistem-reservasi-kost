import { Router } from 'express';
const router = Router();
import { getNotifikasi, markAsRead, markAllAsRead } from '../controllers/notifikasiController';
import { requireAuth } from '../middlewares/authMiddleware';

router.get('/', requireAuth, getNotifikasi);
router.put('/read-all', requireAuth, markAllAsRead);
router.put('/:id/read', requireAuth, markAsRead);

export default router;
