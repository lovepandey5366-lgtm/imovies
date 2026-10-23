import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Theatre name is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    rows: { type: Number, required: true, min: 1, max: 26, default: 8 },
    seatsPerRow: { type: Number, required: true, min: 1, max: 30, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model('Theatre', theatreSchema);
