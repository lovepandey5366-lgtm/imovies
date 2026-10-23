import { Router } from 'express';
import { listTheatres, createTheatre, updateTheatre, deleteTheatre } from '../controllers/theatreController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', listTheatres);
router.post('/', protect, adminOnly, createTheatre);
router.put('/:id', protect, adminOnly, updateTheatre);
router.delete('/:id', protect, adminOnly, deleteTheatre);
export default router;
