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
    await User.create({
      name: 'IMovies Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin created: ${email}`);
  }

  const movies = await Movie.insertMany([
    {
      title: 'Oppenheimer',
      genre: ['Drama', 'Thriller'],
      language: 'English',
      durationMins: 180,
      rating: 8.9,
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    },
    {
      title: 'Interstellar',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      language: 'English',
      durationMins: 169,
      rating: 8.7,
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    {
      title: 'Inception',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      language: 'English',
      durationMins: 148,
      rating: 8.8,
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    },
    {
      title: 'The Dark Knight',
      genre: ['Action', 'Drama', 'Thriller'],
      language: 'English',
      durationMins: 152,
      rating: 9.0,
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
      title: 'Dune: Part Two',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      language: 'English',
      durationMins: 166,
      rating: 8.6,
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      genre: ['Animation', 'Action', 'Adventure'],
      language: 'English',
      durationMins: 140,
      rating: 8.7,
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    },
    {
      title: 'Top Gun: Maverick',
      genre: ['Action', 'Drama'],
      language: 'English',
      durationMins: 130,
      rating: 8.3,
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.",
      posterUrl: 'https://image.tmdb.org/t/p/w500/705nQHqe4JGdEisrQmVYmXyjs1U.jpg',
    },
    {
      title: 'Avatar: The Way of Water',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      language: 'English',
      durationMins: 192,
      rating: 7.7,
      description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    },
    {
      title: 'The Batman',
      genre: ['Action', 'Drama', 'Thriller'],
      language: 'English',
      durationMins: 176,
      rating: 7.9,
      description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    },
    {
      title: 'RRR',
      genre: ['Action', 'Drama'],
      language: 'Hindi',
      durationMins: 182,
      rating: 7.9,
      description: 'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspiring path of freedom against the despotic rulers.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
    },
  ]);

  const theatres = await Theatre.insertMany([
    { name: 'IMovies Grand IMAX', city: 'Indore', rows: 8, seatsPerRow: 12 },
    { name: 'IMovies PVR Lounge', city: 'Indore', rows: 6, seatsPerRow: 8 },
    { name: 'IMovies Cinepolis', city: 'Bhopal', rows: 7, seatsPerRow: 10 },
  ]);

  const slots = [10, 13, 16, 19, 22];
  const shows = [];
  for (let d = 0; d < 4; d++) {
    movies.forEach((m, i) => {
      const t = new Date();
      t.setDate(t.getDate() + d);
      t.setHours(slots[(i + d) % slots.length], 0, 0, 0);
      if (t > new Date()) {
        shows.push({
          movie: m._id,
          theatre: theatres[(i + d) % theatres.length]._id,
          startTime: t,
          price: 180 + ((i + d) % 3) * 60,
        });
      }
    });
  }
  await Show.insertMany(shows);
  console.log(`Seeded ${movies.length} real movies with HD posters, ${theatres.length} theatres, ${shows.length} shows`);
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
