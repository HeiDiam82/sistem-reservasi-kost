import express from 'express';
const router = express.Router();
import { getAll, getById, create, update, remove } from '../controllers/kamarController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);

export default router;
