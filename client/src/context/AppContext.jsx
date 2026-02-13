import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/http';
import { translations } from './translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [background, setBackground] = useState(localStorage.getItem('background') || '');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => localStorage.setItem('language', language), [language]);

  const t = useMemo(() => translations[language] || translations.en, [language]);
  const notify = (message, type = 'info') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 2800);
  };

  const syncSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.theme) setTheme(data.theme);
      if (data.language) setLanguage(data.language);
      if (data.background_image) {
        const bg = `http://localhost:5000${data.background_image}`;
        setBackground(bg);
        localStorage.setItem('background', bg);
      }
    } catch {
      // No-op before authentication.
    }
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, background, setBackground, alerts, notify, t, syncSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
