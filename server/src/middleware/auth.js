import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, httpError } from './error.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) httpError(res, 401, 'Please sign in to continue');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    httpError(res, 401, 'Your session has expired. Please sign in again');
  }
  const user = await User.findById(payload.id).select('-password');
  if (!user) httpError(res, 401, 'Account not found');
  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    return next(new Error('Admin access required'));
  }
  next();
};
