import { useEffect, useState } from 'react';
import api from '../api/http';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0, monthlyRevenue: [] });
  const [notifications, setNotifications] = useState([]);
  const { t } = useApp();

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
    api.get('/dashboard/notifications').then(({ data }) => setNotifications(data));
  }, []);

  return (
    <div>
      <h1>{t.dashboard}</h1>
      <div className="grid cards">
        <div className="glass card"><h3>Users</h3><strong>{stats.users}</strong></div>
        <div className="glass card"><h3>{t.products}</h3><strong>{stats.products}</strong></div>
        <div className="glass card"><h3>{t.orders}</h3><strong>{stats.orders}</strong></div>
        <div className="glass card"><h3>{t.revenue}</h3><strong>${stats.revenue.toLocaleString()}</strong></div>
      </div>
      <div className="glass section">
        <h2>{t.notifications}</h2>
        {notifications.length ? notifications.map((n, i) => <p key={i}>• {n.message}</p>) : <p>No notifications</p>}
      </div>
    </div>
  );
}
