import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '' },
    genre: { type: [String], default: [] },
    language: { type: String, default: 'English' },
    durationMins: { type: Number, required: [true, 'Duration is required'], min: 1 },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    releaseDate: { type: Date },
    posterUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Movie', movieSchema);
