import { Router } from 'express';
import { createBooking, myBookings, allBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, createBooking);
router.get('/mine', protect, myBookings);
router.get('/', protect, adminOnly, allBookings);
router.patch('/:id/cancel', protect, cancelBooking);
export default router;
