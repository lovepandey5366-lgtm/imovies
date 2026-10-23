import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="brand" aria-label="IMovies home">
        <span className="brand-mark" aria-hidden="true" />
        IMovies
      </Link>
      <nav>
        <NavLink to="/" end>Movies</NavLink>
        {user && <NavLink to="/bookings">My tickets</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        {user ? (
          <button className="link-btn" onClick={() => { logout(); navigate('/'); }}>Sign out ({user.name.split(' ')[0]})</button>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <Link to="/register" className="btn small">Create account</Link>
          </>
        )}
      </nav>
    </header>
  );
}
