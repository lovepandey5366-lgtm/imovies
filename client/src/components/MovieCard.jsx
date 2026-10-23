import { Link } from 'react-router-dom';
import Poster from './Poster.jsx';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <Poster movie={movie} />
      <div className="movie-meta">
        <h3>{movie.title}</h3>
        <p>{movie.genre.join(', ') || movie.language} · {movie.durationMins} min</p>
        {movie.rating > 0 && <span className="rating">★ {movie.rating.toFixed(1)}</span>}
      </div>
    </Link>
  );
}
