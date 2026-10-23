import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    startTime: { type: Date, required: [true, 'Start time is required'] },
    price: { type: Number, required: [true, 'Ticket price is required'], min: 0 },
    bookedSeats: { type: [String], default: [] },
  },
  { timestamps: true }
);

showSchema.index({ movie: 1, startTime: 1 });

export default mongoose.model('Show', showSchema);
