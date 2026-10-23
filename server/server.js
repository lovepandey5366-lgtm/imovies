import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/error.js';
import authRoutes from './src/routes/authRoutes.js';
import movieRoutes from './src/routes/movieRoutes.js';
import theatreRoutes from './src/routes/theatreRoutes.js';
import showRoutes from './src/routes/showRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

const app = express();

const origins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ name: 'IMovies API', status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`IMovies API running on port ${PORT}`));
});
