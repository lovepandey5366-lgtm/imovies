import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { asyncHandler, httpError } from '../middleware/error.js';

const bookingPopulate = [
  { path: 'show', populate: [{ path: 'movie', select: 'title posterUrl' }, { path: 'theatre', select: 'name city' }] },
  { path: 'user', select: 'name email' },
];

export const createBooking = asyncHandler(async (req, res) => {
  const { showId, seats } = req.body;
  if (!Array.isArray(seats) || seats.length === 0) httpError(res, 400, 'Select at least one seat');
  if (seats.length > 10) httpError(res, 400, 'You can book up to 10 seats at a time');
  if (new Set(seats).size !== seats.length) httpError(res, 400, 'Duplicate seats selected');

  const show = await Show.findById(showId).populate('theatre');
  if (!show) httpError(res, 404, 'Show not found');
  if (show.startTime < new Date()) httpError(res, 400, 'This show has already started');

  const { rows, seatsPerRow } = show.theatre;
  const valid = seats.every((s) => {
    const m = /^([A-Z])(\d{1,2})$/.exec(s);
    return m && m[1].charCodeAt(0) - 64 <= rows && Number(m[2]) >= 1 && Number(m[2]) <= seatsPerRow;
  });
  if (!valid) httpError(res, 400, 'One or more seats do not exist in this theatre');

  // Atomic claim: only succeeds if none of the requested seats is already booked.
  const claimed = await Show.findOneAndUpdate(
    { _id: showId, bookedSeats: { $nin: seats } },
    { $push: { bookedSeats: { $each: seats } } },
    { new: true }
  );
  if (!claimed) httpError(res, 409, 'Some of those seats were just taken. Please pick different seats');

  const booking = await Booking.create({
    user: req.user._id,
    show: show._id,
    seats,
    totalPrice: seats.length * show.price,
  });
  res.status(201).json(await booking.populate(bookingPopulate));
});

export const myBookings = asyncHandler(async (req, res) => {
  res.json(await Booking.find({ user: req.user._id }).populate(bookingPopulate).sort({ createdAt: -1 }));
});

export const allBookings = asyncHandler(async (_req, res) => {
  res.json(await Booking.find().populate(bookingPopulate).sort({ createdAt: -1 }));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('show');
  if (!booking) httpError(res, 404, 'Booking not found');
  const isOwner = booking.user.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') httpError(res, 403, 'You can only cancel your own bookings');
  if (booking.status === 'cancelled') httpError(res, 400, 'Booking is already cancelled');
  if (booking.show && booking.show.startTime < new Date()) httpError(res, 400, 'Past shows cannot be cancelled');

  booking.status = 'cancelled';
  await booking.save();
  await Show.updateOne({ _id: booking.show?._id }, { $pull: { bookedSeats: { $in: booking.seats } } });
  res.json(await booking.populate(bookingPopulate));
});
