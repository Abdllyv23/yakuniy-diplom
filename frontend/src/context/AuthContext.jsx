import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin') || 'null'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const register = async (payload) => api.post('/auth/register', payload);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const value = useMemo(() => ({ admin, login, logout, register }), [admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
