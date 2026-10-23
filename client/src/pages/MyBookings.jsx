import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, fmtDateTime, rupees } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyBookings() {
  const { token } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  const load = () => api('/bookings/mine', { token }).then(setBookings).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking? The seats will be released.')) return;
    try {
      await api(`/bookings/${id}/cancel`, { method: 'PATCH', token });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="page">
      <h1>My tickets</h1>
      {location.state?.booked && <p className="success">Booking confirmed. Your tickets are below.</p>}
      {error && <p className="error">{error}</p>}
      {!bookings && !error && <p className="muted">Loading…</p>}
      {bookings?.length === 0 && <p className="muted">You have no bookings yet. <Link to="/">Find a movie</Link> to get started.</p>}
      <div className="tickets">
        {bookings?.map((b) => (
          <article key={b._id} className={`ticket ${b.status}`}>
            <div className="ticket-main">
              <h3>{b.show?.movie?.title || 'Movie removed'}</h3>
              <p>{b.show?.theatre?.name}, {b.show?.theatre?.city}</p>
              <p>{b.show && fmtDateTime(b.show.startTime)}</p>
            </div>
            <div className="ticket-stub">
              <strong>{b.seats.join(', ')}</strong>
              <span>{rupees(b.totalPrice)}</span>
              {b.status === 'confirmed' ? (
                <button className="link-btn danger" onClick={() => cancel(b._id)}>Cancel booking</button>
              ) : (
                <em>Cancelled</em>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
