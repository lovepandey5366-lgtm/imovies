import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, fmtDay, fmtTime, rupees } from '../api.js';
import Poster from '../components/Poster.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api(`/movies/${id}`), api(`/shows?movie=${id}`)])
      .then(([m, s]) => { setMovie(m); setShows(s); })
      .catch((e) => setError(e.message));
  }, [id]);

  const byDay = useMemo(() => {
    const map = {};
    shows.forEach((s) => { (map[fmtDay(s.startTime)] ||= []).push(s); });
    return Object.entries(map);
  }, [shows]);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!movie) return <main className="page"><p className="muted">Loading…</p></main>;

  const book = (showId) => (user ? navigate(`/book/${showId}`) : navigate('/login', { state: { from: `/book/${showId}` } }));

  return (
    <main className="page">
      <Link to="/" className="back">‹ All movies</Link>
      <section className="detail">
        <Poster movie={movie} className="detail-poster" />
        <div>
          <h1>{movie.title}</h1>
          <p className="muted">{[movie.language, `${movie.durationMins} min`, movie.genre.join(', ')].filter(Boolean).join(' · ')}</p>
          {movie.rating > 0 && <span className="rating">★ {movie.rating.toFixed(1)} / 10</span>}
          <p className="synopsis">{movie.description || 'No synopsis added yet.'}</p>
        </div>
      </section>

      <h2>Showtimes</h2>
      {byDay.length === 0 && <p className="muted">No upcoming shows for this movie yet. Check back soon.</p>}
      {byDay.map(([day, list]) => (
        <div key={day} className="day-block">
          <h3>{day}</h3>
          <div className="show-list">
            {list.map((s) => (
              <button key={s._id} className="show-pill" onClick={() => book(s._id)}>
                <strong>{fmtTime(s.startTime)}</strong>
                <span>{s.theatre.name}, {s.theatre.city}</span>
                <span>{rupees(s.price)} / seat</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
