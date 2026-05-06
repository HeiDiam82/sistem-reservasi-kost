import { Router } from 'express';
const router = Router();
import { getAllKamar, getKamarById, createKamar, updateKamar, deleteKamar } from '../controllers/kamarController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

router.get('/', getAllKamar);             // publik - untuk tampil di halaman beranda
router.get('/:id', getKamarById);        // publik - untuk halaman detail
router.post('/', requireAdmin, createKamar);
router.put('/:id', requireAdmin, updateKamar);
router.delete('/:id', requireAdmin, deleteKamar);

export default router;
