import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from '../server/src/routes/authRoutes.js';
import movieRoutes from '../server/src/routes/movieRoutes.js';
import theatreRoutes from '../server/src/routes/theatreRoutes.js';
import showRoutes from '../server/src/routes/showRoutes.js';
import bookingRoutes from '../server/src/routes/bookingRoutes.js';
import { notFound, errorHandler } from '../server/src/middleware/error.js';

let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set');
  await mongoose.connect(uri);
  isConnected = true;
};

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ message: 'Database connection failed: ' + err.message });
  }
});

app.get('/api', (_req, res) => res.json({ name: 'IMovies API (Vercel)', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
