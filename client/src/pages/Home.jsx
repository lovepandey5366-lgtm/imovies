import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

const perksCol1 = [
  { icon: '💎', title: 'IMAX with Laser', desc: '4K Ultra-Vivid Dual Projection' },
  { icon: '🍿', title: 'Gourmet Popcorn', desc: 'Fresh Truffle & Warm Butter' },
  { icon: '🎟️', title: 'Instant M-Ticket', desc: 'Paperless Instant QR Entry' },
  { icon: '🔊', title: 'Dolby Atmos 7.1', desc: '360° True Spatial Sound' },
  { icon: '⚡', title: 'Zero Booking Fee', desc: 'Special Student Discount' },
];

const perksCol2 = [
  { icon: '🛋️', title: 'VIP Loungers', desc: '180° Motorized Reclining' },
  { icon: '🥤', title: 'Chilled Mocktails', desc: 'Crafted Sodas & Shakes' },
  { icon: '🕶️', title: 'RealD 3D Vision', desc: 'Ultra High-Frame Clarity' },
  { icon: '⭐', title: 'Indore Grand IMAX', desc: 'Premium Hall Atmosphere' },
  { icon: '🍕', title: 'Café Refreshments', desc: 'Hot Handcrafted Pizza' },
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setStatus('loading');
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (genre) params.set('genre', genre);
      api(`/movies?${params}`)
        .then((d) => {
          setMovies(d);
          setStatus('ready');
        })
        .catch((e) => {
          setError(e.message);
          setStatus('error');
        });
    }, 250);
    return () => clearTimeout(t);
  }, [q, genre]);

  const genres = ['Comedy', 'Romance', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Adventure', 'Animation'];

  return (
    <main className="page">
      {/* Hero Section with Left Content & Right Dynamic Vertical Streaming Tiles */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="pulse-dot"></span> LIVE CINEMA TICKETING
          </span>
          <h1>Pick a film.<br />Pick your seat.</h1>
          <p>Browse blockbuster titles playing near you and book tickets in seconds.</p>
          <div className="search">
            <input
              type="search"
              placeholder="Search by movie title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search movies"
            />
          </div>
          <div className="chips" role="group" aria-label="Filter by genre">
            <button className={`chip ${genre === '' ? 'on' : ''}`} onClick={() => setGenre('')}>
              All
            </button>
            {genres.map((g) => (
              <button key={g} className={`chip ${genre === g ? 'on' : ''}`} onClick={() => setGenre(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Right-Side Vertical Moving Tiles Stream */}
        <div className="hero-stream-container" aria-label="Cinema highlights vertical stream">
          <div className="stream-column stream-up">
            <div className="stream-track">
              {[...perksCol1, ...perksCol1].map((p, i) => (
                <div key={`up-${i}`} className="stream-card">
                  <span className="stream-icon">{p.icon}</span>
                  <div className="stream-details">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="stream-column stream-down">
            <div className="stream-track">
              {[...perksCol2, ...perksCol2].map((p, i) => (
                <div key={`down-${i}`} className="stream-card">
                  <span className="stream-icon">{p.icon}</span>
                  <div className="stream-details">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Infinite Moving Reel */}
      {movies.length > 0 && !q && !genre && (
        <section className="marquee-section" aria-label="Trending movies reel">
          <div className="marquee-header">
            <span className="marquee-badge">🔥 TRENDING IN THEATRES</span>
            <span className="marquee-hint">Auto-gliding · Hover to pause · Click to book</span>
          </div>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...movies, ...movies].map((m, idx) => (
                <Link to={`/movies/${m._id}`} key={`${m._id}-${idx}`} className="marquee-card">
                  <img src={m.posterUrl} alt={m.title} className="marquee-img" loading="lazy" />
                  <div className="marquee-info">
                    <strong>{m.title}</strong>
                    <span>★ {m.rating ? m.rating.toFixed(1) : '8.0'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {status === 'loading' && <p className="muted">Loading movies…</p>}
      {status === 'error' && (
        <p className="error">
          Could not load movies: {error}. If the server was idle it may take up to a minute to wake up. Try again shortly.
        </p>
      )}
      {status === 'ready' && movies.length === 0 && (
        <p className="muted">No movies match that search. Clear the filters to see everything.</p>
      )}

      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </main>
  );
}
