import { useState } from 'react';

// Shows the poster image if available, with a clean gradient fallback if loading fails.
const hue = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

export default function Poster({ movie, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (movie.posterUrl && !imgFailed) {
    return (
      <img
        className={`poster ${className}`}
        src={movie.posterUrl}
        alt={`${movie.title} poster`}
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    );
  }

  const h = hue(movie.title || 'Movie');
  return (
    <div
      className={`poster poster-fallback ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(${h}, 70%, 45%), hsl(${(h + 40) % 360}, 80%, 25%))`,
        color: '#ffffff',
      }}
      role="img"
      aria-label={`${movie.title} poster`}
    >
      <span>{movie.title}</span>
    </div>
  );
}
