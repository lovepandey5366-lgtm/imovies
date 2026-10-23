import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page narrow">
      <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <form onSubmit={submit} className="form">
        {isRegister && (
          <label>Full name<input required value={form.name} onChange={set('name')} autoComplete="name" /></label>
        )}
        <label>Email<input type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></label>
        <label>Password<input type="password" required minLength={6} value={form.password} onChange={set('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="muted">
        {isRegister ? <>Already have an account? <Link to="/login">Sign in</Link></> : <>New to IMovies? <Link to="/register">Create an account</Link></>}
      </p>
    </main>
  );
}
