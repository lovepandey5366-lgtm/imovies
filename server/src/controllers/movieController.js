import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { asyncHandler, httpError } from '../middleware/error.js';

export const listMovies = asyncHandler(async (req, res) => {
  const { q, genre } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (genre) filter.genre = genre;
  res.json(await Movie.find(filter).sort({ createdAt: -1 }));
});

export const getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) httpError(res, 404, 'Movie not found');
  res.json(movie);
});

export const createMovie = asyncHandler(async (req, res) => {
  res.status(201).json(await Movie.create(req.body));
});

export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!movie) httpError(res, 404, 'Movie not found');
  res.json(movie);
});

export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) httpError(res, 404, 'Movie not found');
  await Show.deleteMany({ movie: movie._id });
  res.json({ message: 'Movie deleted' });
});
