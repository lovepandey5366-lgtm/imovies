import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import { asyncHandler, httpError } from '../middleware/error.js';

const populate = [
  { path: 'movie', select: 'title posterUrl durationMins language' },
  { path: 'theatre', select: 'name city rows seatsPerRow' },
];

export const listShows = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.movie) filter.movie = req.query.movie;
  const includeAll = String(req.query.all ?? '').toLowerCase() === 'true';
  if (!includeAll) filter.startTime = { $gte: new Date() };
  res.json(await Show.find(filter).populate(populate).sort({ startTime: 1 }));
});

export const getShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate(populate);
  if (!show) httpError(res, 404, 'Show not found');
  res.json(show);
});

export const createShow = asyncHandler(async (req, res) => {
  const { movie, theatre } = req.body;
  if (!(await Movie.exists({ _id: movie }))) httpError(res, 400, 'Choose a valid movie');
  if (!(await Theatre.exists({ _id: theatre }))) httpError(res, 400, 'Choose a valid theatre');
  const show = await Show.create({ ...req.body, bookedSeats: [] });
  res.status(201).json(await show.populate(populate));
});

export const deleteShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id);
  if (!show) httpError(res, 404, 'Show not found');
  await Promise.all([
    Show.deleteOne({ _id: show._id }),
    Booking.deleteMany({ show: show._id }),
  ]);
  res.json({ message: 'Show deleted' });
});
