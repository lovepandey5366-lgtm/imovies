import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, httpError } from '../middleware/error.js';

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, token: sign(u._id) });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email: String(email || '').toLowerCase() })) httpError(res, 400, 'An account with this email already exists');
  const user = await User.create({ name, email, password }); // role always "user"
  res.status(201).json(payload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password || ''))) httpError(res, 401, 'Incorrect email or password');
  res.json(payload(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
});
