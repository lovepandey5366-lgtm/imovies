import { Router } from 'express';
import { listShows, getShow, createShow, deleteShow } from '../controllers/showController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', listShows);
router.get('/:id', getShow);
router.post('/', protect, adminOnly, createShow);
router.delete('/:id', protect, adminOnly, deleteShow);
export default router;
