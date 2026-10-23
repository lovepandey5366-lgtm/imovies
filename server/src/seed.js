import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Theatre from './models/Theatre.js';
import Show from './models/Show.js';
import Booking from './models/Booking.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Movie.deleteMany(), Theatre.deleteMany(), Show.deleteMany(), Booking.deleteMany()]);

  const email = (process.env.ADMIN_EMAIL || 'admin@imovies.com').toLowerCase();
  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'IMovies Admin', email, password: process.env.ADMIN_PASSWORD || 'Admin@123', role: 'admin' });
    console.log(`Admin created: ${email}`);
  }

  const movies = await Movie.insertMany([
    { title: 'Midnight Express Line', genre: ['Thriller'], language: 'English', durationMins: 128, rating: 8.1, description: 'A night-shift conductor discovers that one carriage on the last train never appears on the timetable.' },
    { title: 'Monsoon Letters', genre: ['Romance', 'Drama'], language: 'Hindi', durationMins: 141, rating: 7.8, description: 'Two strangers in different cities swap handwritten letters through one long rainy season.' },
    { title: 'Orbit Kitchen', genre: ['Comedy', 'Sci-Fi'], language: 'English', durationMins: 109, rating: 7.4, description: 'The first restaurant on a space station has exactly one chef and zero gravity.' },
    { title: 'The Last Cricket Ball', genre: ['Sports', 'Drama'], language: 'Hindi', durationMins: 152, rating: 8.4, description: 'A small-town team gets one final match to save its ground from being sold.' },
    { title: 'Haunted Hostel 13', genre: ['Horror'], language: 'English', durationMins: 97, rating: 6.9, description: 'Freshers move into the one wing the college refuses to talk about.' },
    { title: 'Desert Compass', genre: ['Adventure'], language: 'English', durationMins: 134, rating: 7.6, description: 'A map-maker and a camel driver race across the Thar to reach a vanished well.' },
  ]);

  const theatres = await Theatre.insertMany([
    { name: 'IMovies Grand', city: 'Indore', rows: 8, seatsPerRow: 12 },
    { name: 'IMovies Lounge', city: 'Indore', rows: 6, seatsPerRow: 8 },
    { name: 'IMovies Central', city: 'Bhopal', rows: 7, seatsPerRow: 10 },
  ]);

  const slots = [11, 14, 18, 21];
  const shows = [];
  for (let d = 0; d < 4; d++) {
    movies.forEach((m, i) => {
      const t = new Date();
      t.setDate(t.getDate() + d);
      t.setHours(slots[(i + d) % slots.length], 0, 0, 0);
      if (t > new Date()) shows.push({ movie: m._id, theatre: theatres[(i + d) % theatres.length]._id, startTime: t, price: 150 + ((i + d) % 3) * 50 });
    });
  }
  await Show.insertMany(shows);
  console.log(`Seeded ${movies.length} movies, ${theatres.length} theatres, ${shows.length} shows`);
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
