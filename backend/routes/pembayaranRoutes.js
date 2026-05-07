import express from 'express';
const router = express.Router();
import { getAll, create, updateStatus } from '../controllers/pembayaranController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

router.get('/', requireAuth, getAll);
router.post('/', requireAuth, create);
router.put('/:id/status', requireAdmin, updateStatus);

export default router;
