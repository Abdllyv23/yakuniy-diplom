import { useEffect, useState } from 'react';
import i18n from '../i18n';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { theme, language, updateTheme, updateLanguage, updateBackground, notify } = useApp();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get('/settings').then((r) => {
      const data = r.data;
      if (!data) return;
      setSelectedTheme(data.theme || theme);
      setSelectedLanguage(data.language || language);
      if (data.background_image) updateBackground(`http://localhost:5000${data.background_image}`);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('theme', selectedTheme);
    form.append('language', selectedLanguage);
    if (file) form.append('backgroundImage', file);

    const { data } = await api.put('/settings', form);
    updateTheme(data.theme);
    updateLanguage(data.language);
    i18n.changeLanguage(data.language);
    if (data.background_image) updateBackground(`http://localhost:5000${data.background_image}`);
    notify('Settings updated');
  };

  return (
    <div>
      <h1>Settings</h1>
      <form className="grid cols-2" onSubmit={save}>
        <label>Theme<select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></label>
        <label>Language<select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}><option value="en">English</option><option value="uz">Uzbek</option><option value="ru">Russian</option></select></label>
        <label>Background Image<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></label>
        <button>Save Settings</button>
      </form>
    </div>
  );
}
