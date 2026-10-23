import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import { asyncHandler, httpError } from '../middleware/error.js';

export const listTheatres = asyncHandler(async (_req, res) => {
  res.json(await Theatre.find().sort({ city: 1, name: 1 }));
});

export const createTheatre = asyncHandler(async (req, res) => {
  res.status(201).json(await Theatre.create(req.body));
});

export const updateTheatre = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!theatre) httpError(res, 404, 'Theatre not found');
  res.json(theatre);
});

export const deleteTheatre = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findByIdAndDelete(req.params.id);
  if (!theatre) httpError(res, 404, 'Theatre not found');
  await Show.deleteMany({ theatre: theatre._id });
  res.json({ message: 'Theatre deleted' });
});
