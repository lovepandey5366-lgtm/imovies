import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, fmtDateTime, rupees } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SeatSelection() {
  const { showId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [picked, setPicked] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api(`/shows/${showId}`).then(setShow).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [showId]);

  if (!show) return <main className="page">{error ? <p className="error">{error}</p> : <p className="muted">Loading seats…</p>}</main>;

  const { rows, seatsPerRow } = show.theatre;
  const taken = new Set(show.bookedSeats);
  const toggle = (id) => {
    if (taken.has(id)) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 10 ? p : [...p, id]));
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await api('/bookings', { method: 'POST', token, body: { showId, seats: picked } });
      navigate('/bookings', { state: { booked: true } });
    } catch (e) {
      setError(e.message);
      setPicked([]);
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <h1>{show.movie.title}</h1>
      <p className="muted">{show.theatre.name}, {show.theatre.city} · {fmtDateTime(show.startTime)} · {rupees(show.price)} per seat</p>

      <div className="screen" aria-hidden="true"><span>Screen this way</span></div>
      <div className="seat-map" role="group" aria-label="Seat map">
        {Array.from({ length: rows }, (_, r) => {
          const letter = String.fromCharCode(65 + r);
          return (
            <div className="seat-row" key={letter}>
              <span className="row-label">{letter}</span>
              {Array.from({ length: seatsPerRow }, (_, c) => {
                const id = `${letter}${c + 1}`;
                const state = taken.has(id) ? 'taken' : picked.includes(id) ? 'picked' : '';
                return (
                  <button key={id} className={`seat ${state}`} disabled={taken.has(id)} aria-pressed={picked.includes(id)} aria-label={`Seat ${id}${taken.has(id) ? ', taken' : ''}`} onClick={() => toggle(id)}>
                    {c + 1}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span><i className="seat sample" /> Available</span>
        <span><i className="seat sample picked" /> Your pick</span>
        <span><i className="seat sample taken" /> Taken</span>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="checkout">
        <div>
          <strong>{picked.length ? picked.join(', ') : 'No seats selected'}</strong>
          <span className="muted">{picked.length} × {rupees(show.price)} = <b>{rupees(picked.length * show.price)}</b></span>
        </div>
        <button className="btn" disabled={!picked.length || busy} onClick={confirm}>{busy ? 'Booking…' : 'Book tickets'}</button>
      </div>
    </main>
  );
}
