import { useEffect, useState } from 'react';
import api from '../api/http';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { theme, setTheme, language, setLanguage, setBackground, notify, syncSettings } = useApp();
  const [bg, setBg] = useState(null);

  useEffect(() => { syncSettings(); }, []);

  const save = async () => {
    await api.put('/settings', { theme, language });
    notify('Settings updated', 'success');
  };

  const uploadBg = async () => {
    if (!bg) return;
    const fd = new FormData();
    fd.append('image', bg);
    const { data } = await api.post('/settings/background', fd);
    const url = `http://localhost:5000${data.background_image}`;
    setBackground(url);
    localStorage.setItem('background', url);
    notify('Background updated', 'success');
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="glass form">
        <label>Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select>
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}><option value="en">English</option><option value="ru">Русский</option><option value="uz">O'zbek</option></select>
        <button onClick={save}>Save settings</button>
      </div>
      <div className="glass form">
        <label>Background image</label>
        <input type="file" accept="image/*" onChange={(e) => setBg(e.target.files[0])} />
        <button onClick={uploadBg}>Upload background</button>
      </div>
    </div>
  );
}
