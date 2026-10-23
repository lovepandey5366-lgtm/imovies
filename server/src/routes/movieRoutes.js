import { Router } from 'express';
import { listMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', listMovies);
router.get('/:id', getMovie);
router.post('/', protect, adminOnly, createMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);
export default router;
