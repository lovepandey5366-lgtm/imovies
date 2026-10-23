import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('imovies_user'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const save = (u) => {
    localStorage.setItem('imovies_user', JSON.stringify(u));
    setUser(u);
  };

  const login = useCallback(async (email, password) => save(await api('/auth/login', { method: 'POST', body: { email, password } })), []);
  const register = useCallback(async (name, email, password) => save(await api('/auth/register', { method: 'POST', body: { name, email, password } })), []);
  const logout = useCallback(() => {
    localStorage.removeItem('imovies_user');
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, token: user?.token, login, register, logout }}>{children}</AuthContext.Provider>;
}
