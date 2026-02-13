import { useEffect, useState } from 'react';
import api from '../api/http';
import { useApp } from '../context/AppContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { t, notify } = useApp();

  const load = () => api.get('/orders', { params: { search, status } }).then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, [search, status]);

  return (
    <div>
      <h1>{t.orders}</h1>
      <div className="toolbar">
        <input className="glass" placeholder="Search order or customer" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="glass" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option>pending</option><option>paid</option><option>shipped</option><option>delivered</option>
        </select>
      </div>
      <div className="glass table-wrap">
        <table><thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Action</th></tr></thead><tbody>
          {orders.map((o) => (
            <tr key={o.id}><td>#{o.id}</td><td>{o.full_name || 'Guest'}</td><td>{o.status}</td><td>${o.total_amount}</td>
              <td><button onClick={async () => { await api.put(`/orders/${o.id}/status`, { status: 'delivered' }); load(); notify('Order marked delivered', 'success'); }}>Mark delivered</button></td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
