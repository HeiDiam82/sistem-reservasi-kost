import { Router } from 'express';
const router = Router();
import { getAllTipeKamar, getTipeKamarById, createTipeKamar, updateTipeKamar, deleteTipeKamar } from '../controllers/tipeKamarController';
import { requireAdmin } from '../middlewares/authMiddleware';

router.get('/', getAllTipeKamar);
router.get('/:id', getTipeKamarById);
router.post('/', requireAdmin, createTipeKamar);
router.put('/:id', requireAdmin, updateTipeKamar);
router.delete('/:id', requireAdmin, deleteTipeKamar);

export default router;
