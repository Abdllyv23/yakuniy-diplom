import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard Analytics</h1>
      <div className="grid cols-4">
        <div className="card glass"><h3>Products</h3><p>{stats.counts.products}</p></div>
        <div className="card glass"><h3>Orders</h3><p>{stats.counts.orders}</p></div>
        <div className="card glass"><h3>Users</h3><p>{stats.counts.users}</p></div>
        <div className="card glass"><h3>Revenue</h3><p>${stats.revenue}</p></div>
      </div>
      <h2>Recent Orders</h2>
      <table><thead><tr><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {stats.recentOrders.map((o) => <tr key={o.id}><td>{o.customer_name}</td><td>${o.total}</td><td>{o.status}</td></tr>)}
      </tbody></table>
    </div>
  );
}
