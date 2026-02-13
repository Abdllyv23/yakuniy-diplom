import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

const blank = { fullName: '', email: '', role: 'customer', status: 'active' };

export default function Users() {
  const { notify } = useApp();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState('');

  const load = () => api.get('/users', { params: { search } }).then((r) => setUsers(r.data));
  useEffect(() => { load(); }, [search]);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/users', form);
    notify('User added');
    setForm(blank);
    load();
  };

  return (
    <div>
      <h1>User Management</h1>
      <input placeholder="Search users" onChange={(e) => setSearch(e.target.value)} />
      <form className="grid cols-4" onSubmit={add}>
        <input value={form.fullName} placeholder="Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input value={form.email} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>customer</option><option>manager</option></select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>active</option><option>blocked</option></select>
        <button>Add User</button>
      </form>
      <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead><tbody>
        {users.map((u) => <tr key={u.id}><td>{u.full_name}</td><td>{u.email}</td><td><select value={u.role} onChange={async (e) => { await api.put(`/users/${u.id}`, { role: e.target.value }); load(); }}><option>customer</option><option>manager</option></select></td><td><select value={u.status} onChange={async (e) => { await api.put(`/users/${u.id}`, { status: e.target.value }); load(); }}><option>active</option><option>blocked</option></select></td><td><button onClick={async () => { await api.delete(`/users/${u.id}`); notify('User deleted'); load(); }}>Delete</button></td></tr>)}
      </tbody></table>
    </div>
  );
}
