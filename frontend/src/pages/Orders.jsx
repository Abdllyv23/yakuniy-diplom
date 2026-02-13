import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function Orders() {
  const { notify } = useApp();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = () => api.get('/orders', { params: { search, status } }).then((r) => setOrders(r.data));
  useEffect(() => { load(); }, [search, status]);

  return (
    <div>
      <h1>Order Management</h1>
      <div className="toolbar"><input placeholder="Search customer" onChange={(e) => setSearch(e.target.value)} /><select onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option value="pending">pending</option><option value="completed">completed</option><option value="cancelled">cancelled</option></select></div>
      <table><thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th><th /></tr></thead><tbody>
        {orders.map((o) => <tr key={o.id}><td>{o.customer_name}</td><td>${o.total}</td><td><select value={o.status} onChange={async (e) => { await api.put(`/orders/${o.id}`, { status: e.target.value }); notify('Order updated'); load(); }}><option>pending</option><option>completed</option><option>cancelled</option></select></td><td>{o.payment_status}</td><td><button onClick={async () => { await api.delete(`/orders/${o.id}`); notify('Order deleted'); load(); }}>Delete</button></td></tr>)}
      </tbody></table>
    </div>
  );
}
