// Shows the poster image if there is one, otherwise a generated colour panel from the title.
const hue = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

export default function Poster({ movie, className = '' }) {
  if (movie.posterUrl) return <img className={`poster ${className}`} src={movie.posterUrl} alt={`${movie.title} poster`} loading="lazy" />;
  const h = hue(movie.title);
  return (
    <div className={`poster poster-fallback ${className}`} style={{ background: `linear-gradient(160deg, hsl(${h} 55% 32%), hsl(${(h + 50) % 360} 60% 16%))` }} role="img" aria-label={`${movie.title} poster`}>
      <span>{movie.title}</span>
    </div>
  );
}
