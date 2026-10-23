import { useEffect, useState } from 'react';
import { api, fmtDateTime, rupees } from '../../api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const tabs = ['Movies', 'Theatres', 'Shows', 'Bookings'];

export default function Admin() {
  const { token } = useAuth();
  const [tab, setTab] = useState('Movies');
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try {
      const [m, t, s, b] = await Promise.all([
        api('/movies'), api('/theatres'), api('/shows?all=true'), api('/bookings', { token }),
      ]);
      setMovies(m); setTheatres(t); setShows(s); setBookings(b);
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { refresh(); }, []);

  const run = async (fn, okMsg) => {
    setError(''); setMsg('');
    try { await fn(); setMsg(okMsg); await refresh(); return true; } catch (e) { setError(e.message); return false; }
  };
  const del = (path, what) => window.confirm(`Delete this ${what}? This cannot be undone.`) && run(() => api(path, { method: 'DELETE', token }), `${what} deleted`);

  return (
    <main className="page">
      <h1>Admin</h1>
      <div className="tabs" role="tablist">
        {tabs.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'on' : ''}`} onClick={() => { setTab(t); setError(''); setMsg(''); }}>{t}</button>)}
      </div>
      {error && <p className="error">{error}</p>}
      {msg && <p className="success">{msg}</p>}

      {tab === 'Movies' && <MovieAdmin movies={movies} token={token} run={run} del={del} />}
      {tab === 'Theatres' && <TheatreAdmin theatres={theatres} token={token} run={run} del={del} />}
      {tab === 'Shows' && <ShowAdmin shows={shows} movies={movies} theatres={theatres} token={token} run={run} del={del} />}
      {tab === 'Bookings' && (
        <table className="table">
          <thead><tr><th>Customer</th><th>Movie</th><th>Show</th><th>Seats</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name}<br /><small>{b.user?.email}</small></td>
                <td>{b.show?.movie?.title}</td>
                <td>{b.show && fmtDateTime(b.show.startTime)}</td>
                <td>{b.seats.join(', ')}</td>
                <td>{rupees(b.totalPrice)}</td>
                <td>{b.status}</td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="6" className="muted">No bookings yet.</td></tr>}
          </tbody>
        </table>
      )}
    </main>
  );
}

function MovieAdmin({ movies, token, run, del }) {
  const empty = { title: '', description: '', genre: '', language: 'English', durationMins: 120, rating: 7, posterUrl: '' };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...f, genre: f.genre.split(',').map((g) => g.trim()).filter(Boolean), durationMins: Number(f.durationMins), rating: Number(f.rating) };
    if (await run(() => api('/movies', { method: 'POST', token, body }), 'Movie added')) setF(empty);
  };
  return (
    <>
      <form className="form row" onSubmit={submit}>
        <label>Title<input required value={f.title} onChange={set('title')} /></label>
        <label>Genres (comma separated)<input value={f.genre} onChange={set('genre')} placeholder="Drama, Comedy" /></label>
        <label>Language<input value={f.language} onChange={set('language')} /></label>
        <label>Duration (min)<input type="number" min="1" required value={f.durationMins} onChange={set('durationMins')} /></label>
        <label>Rating (0-10)<input type="number" min="0" max="10" step="0.1" value={f.rating} onChange={set('rating')} /></label>
        <label>Poster image URL (optional)<input value={f.posterUrl} onChange={set('posterUrl')} placeholder="https://" /></label>
        <label className="wide">Synopsis<textarea rows="2" value={f.description} onChange={set('description')} /></label>
        <button className="btn">Add movie</button>
      </form>
      <table className="table">
        <thead><tr><th>Title</th><th>Genre</th><th>Duration</th><th /></tr></thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m._id}><td>{m.title}</td><td>{m.genre.join(', ')}</td><td>{m.durationMins} min</td>
              <td><button className="link-btn danger" onClick={() => del(`/movies/${m._id}`, 'movie')}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TheatreAdmin({ theatres, token, run, del }) {
  const empty = { name: '', city: '', rows: 8, seatsPerRow: 10 };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...f, rows: Number(f.rows), seatsPerRow: Number(f.seatsPerRow) };
    if (await run(() => api('/theatres', { method: 'POST', token, body }), 'Theatre added')) setF(empty);
  };
  return (
    <>
      <form className="form row" onSubmit={submit}>
        <label>Theatre name<input required value={f.name} onChange={set('name')} /></label>
        <label>City<input required value={f.city} onChange={set('city')} /></label>
        <label>Rows (1-26)<input type="number" min="1" max="26" required value={f.rows} onChange={set('rows')} /></label>
        <label>Seats per row (1-30)<input type="number" min="1" max="30" required value={f.seatsPerRow} onChange={set('seatsPerRow')} /></label>
        <button className="btn">Add theatre</button>
      </form>
      <table className="table">
        <thead><tr><th>Name</th><th>City</th><th>Capacity</th><th /></tr></thead>
        <tbody>
          {theatres.map((t) => (
            <tr key={t._id}><td>{t.name}</td><td>{t.city}</td><td>{t.rows * t.seatsPerRow} seats</td>
              <td><button className="link-btn danger" onClick={() => del(`/theatres/${t._id}`, 'theatre')}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ShowAdmin({ shows, movies, theatres, token, run, del }) {
  const [f, setF] = useState({ movie: '', theatre: '', startTime: '', price: 200 });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...f, price: Number(f.price), startTime: new Date(f.startTime).toISOString() };
    await run(() => api('/shows', { method: 'POST', token, body }), 'Show scheduled');
  };
  return (
    <>
      <form className="form row" onSubmit={submit}>
        <label>Movie
          <select required value={f.movie} onChange={set('movie')}><option value="">Choose a movie</option>{movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}</select>
        </label>
        <label>Theatre
          <select required value={f.theatre} onChange={set('theatre')}><option value="">Choose a theatre</option>{theatres.map((t) => <option key={t._id} value={t._id}>{t.name}, {t.city}</option>)}</select>
        </label>
        <label>Start time<input type="datetime-local" required value={f.startTime} onChange={set('startTime')} /></label>
        <label>Price per seat (₹)<input type="number" min="0" required value={f.price} onChange={set('price')} /></label>
        <button className="btn">Schedule show</button>
      </form>
      <table className="table">
        <thead><tr><th>Movie</th><th>Theatre</th><th>Starts</th><th>Price</th><th>Booked</th><th /></tr></thead>
        <tbody>
          {shows.map((s) => (
            <tr key={s._id}><td>{s.movie?.title}</td><td>{s.theatre?.name}</td><td>{fmtDateTime(s.startTime)}</td><td>{rupees(s.price)}</td><td>{s.bookedSeats.length}</td>
              <td><button className="link-btn danger" onClick={() => del(`/shows/${s._id}`, 'show')}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
