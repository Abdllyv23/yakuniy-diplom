import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('bg') || '');
  const [alerts, setAlerts] = useState([]);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 3000);
  };

  const updateTheme = (value) => {
    localStorage.setItem('theme', value);
    setTheme(value);
  };

  const updateLanguage = (value) => {
    localStorage.setItem('lang', value);
    setLanguage(value);
  };

  const updateBackground = (value) => {
    localStorage.setItem('bg', value || '');
    setBackgroundImage(value || '');
  };

  const value = useMemo(() => ({
    theme,
    language,
    backgroundImage,
    alerts,
    notify,
    updateTheme,
    updateLanguage,
    updateBackground
  }), [theme, language, backgroundImage, alerts]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
