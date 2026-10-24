import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from '../server/src/routes/authRoutes.js';
import movieRoutes from '../server/src/routes/movieRoutes.js';
import theatreRoutes from '../server/src/routes/theatreRoutes.js';
import showRoutes from '../server/src/routes/showRoutes.js';
import bookingRoutes from '../server/src/routes/bookingRoutes.js';
import { notFound, errorHandler } from '../server/src/middleware/error.js';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not defined in Vercel settings');
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    }).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
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

app.get('/api', (_req, res) => res.json({ name: 'IMovies API', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
