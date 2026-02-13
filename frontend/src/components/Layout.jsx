import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { theme, backgroundImage, updateLanguage } = useApp();
  const location = useLocation();

  const nav = [
    ['/', t('dashboard')],
    ['/products', t('products')],
    ['/orders', t('orders')],
    ['/users', t('users')],
    ['/settings', t('settings')]
  ];

  return (
    <div className={`app ${theme}`} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
      <aside className="sidebar glass">
        <h2>Seller Admin</h2>
        {nav.map(([to, label]) => (
          <Link key={to} to={to} className={location.pathname === to ? 'active' : ''}>{label}</Link>
        ))}
        <button onClick={logout}>{t('logout')}</button>
        <select value={i18n.language} onChange={(e) => { i18n.changeLanguage(e.target.value); updateLanguage(e.target.value); }}>
          <option value="en">EN</option>
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
        </select>
      </aside>
      <main className="content glass"><Outlet /></main>
    </div>
  );
}
