import { Router } from 'express';
const router = Router();
import { getAllPembayaran, createPembayaran, updateStatusPembayaran } from '../controllers/pembayaranController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

router.get('/', requireAuth, getAllPembayaran);
router.post('/', requireAuth, createPembayaran);
router.put('/:id/status', requireAdmin, updateStatusPembayaran);

export default router;
