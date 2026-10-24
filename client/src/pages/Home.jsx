import { useEffect, useState } from 'react';
import { api } from '../api.js';
import MovieCard from '../components/MovieCard.jsx';

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
        .then((d) => { setMovies(d); setStatus('ready'); })
        .catch((e) => { setError(e.message); setStatus('error'); });
    }, 250);
    return () => clearTimeout(t);
  }, [q, genre]);

  const genres = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Adventure', 'Animation', 'Comedy', 'Romance'];

  return (
    <main className="page">
      <section className="hero">
        <span className="hero-badge">🎬 Now Showing in Theatres</span>
        <h1>Pick a film.<br />Pick your seat.</h1>
        <p>Browse blockbuster titles playing near you and book tickets in seconds.</p>
        <div className="search">
          <input type="search" placeholder="Search by movie title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search movies" />
        </div>
        <div className="chips" role="group" aria-label="Filter by genre">
          <button className={`chip ${genre === '' ? 'on' : ''}`} onClick={() => setGenre('')}>All</button>
          {genres.map((g) => (
            <button key={g} className={`chip ${genre === g ? 'on' : ''}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      </section>

      {status === 'loading' && <p className="muted">Loading movies…</p>}
      {status === 'error' && <p className="error">Could not load movies: {error}. If the server was idle it may take up to a minute to wake up. Try again shortly.</p>}
      {status === 'ready' && movies.length === 0 && <p className="muted">No movies match that search. Clear the filters to see everything.</p>}
      <div className="grid">{movies.map((m) => <MovieCard key={m._id} movie={m} />)}</div>
    </main>
  );
}
