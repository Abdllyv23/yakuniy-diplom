import { useEffect, useState } from 'react';
import api from '../api/http';
import { useApp } from '../context/AppContext';

const empty = { fullName: '', email: '', phone: '', status: 'active' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const { t, notify } = useApp();
  const load = () => api.get('/users', { params: { search } }).then(({ data }) => setUsers(data));
  useEffect(() => { load(); }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/users/${editing}`, form);
    else await api.post('/users', form);
    setForm(empty); setEditing(null); load(); notify('User saved', 'success');
  };

  return (
    <div>
      <h1>{t.users}</h1>
      <input className="glass" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
      <form className="glass form" onSubmit={submit}>
        <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>active</option><option>blocked</option></select>
        <button>{editing ? 'Update' : 'Add'} User</button>
      </form>
      <div className="glass table-wrap">
        <table><thead><tr><th>Name</th><th>Email</th><th>Status</th><th /></tr></thead><tbody>
          {users.map((u) => (
            <tr key={u.id}><td>{u.full_name}</td><td>{u.email}</td><td>{u.status}</td><td>
              <button onClick={() => { setEditing(u.id); setForm({ fullName: u.full_name, email: u.email, phone: u.phone, status: u.status }); }}>Edit</button>
              <button onClick={async () => { await api.delete(`/users/${u.id}`); load(); notify('User removed', 'warning'); }}>Delete</button>
            </td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
