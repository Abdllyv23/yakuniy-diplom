import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Alerts from './Alerts';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, background } = useApp();

  const nav = [
    ['/', t.dashboard],
    ['/products', t.products],
    ['/orders', t.orders],
    ['/users', t.users],
    ['/settings', t.settings],
  ];

  return (
    <div className="app-shell" style={background ? { backgroundImage: `url(${background})` } : {}}>
      <aside className="sidebar glass">
        <h2>Seller Admin</h2>
        {nav.map(([path, label]) => (
          <Link key={path} to={path} className={pathname === path ? 'active' : ''}>{label}</Link>
        ))}
        <button onClick={() => { localStorage.removeItem('token'); navigate('/auth'); }}>{t.logout}</button>
      </aside>
      <main className="content">
        {children}
      </main>
      <Alerts />
    </div>
  );
}
