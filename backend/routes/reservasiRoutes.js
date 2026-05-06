import { Router } from 'express';
const router = Router();
import { getAllReservasi, getReservasiById, createReservasi, updateStatusReservasi } from '../controllers/reservasiController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

router.get('/', requireAuth, getAllReservasi);
router.get('/:id', requireAuth, getReservasiById);
router.post('/', requireAuth, createReservasi);
router.put('/:id/status', requireAdmin, updateStatusReservasi);

export default router;
