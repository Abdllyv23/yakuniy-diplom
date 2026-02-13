import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

const empty = { name: '', description: '', price: '', stock: '', category: '' };

export default function Products() {
  const { notify } = useApp();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const load = () => api.get('/products', { params: { search, category } }).then((r) => setProducts(r.data));
  useEffect(() => { load(); }, [search, category]);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('image', file);

    if (editing) await api.put(`/products/${editing}`, data);
    else await api.post('/products', data);

    notify(editing ? 'Product updated' : 'Product created');
    setForm(empty); setEditing(null); setFile(null); load();
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category });
  };

  return (
    <div>
      <h1>Product Management</h1>
      <div className="toolbar"><input placeholder="Search" onChange={(e) => setSearch(e.target.value)} /><input placeholder="Category" onChange={(e) => setCategory(e.target.value)} /></div>
      <form className="grid cols-3" onSubmit={submit}>
        <input value={form.name} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input value={form.category} placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input value={form.price} type="number" placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input value={form.stock} type="number" placeholder="Stock" onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <input value={form.description} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button>{editing ? 'Update' : 'Add'} Product</button>
      </form>
      <table><thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th /></tr></thead><tbody>
        {products.map((p) => <tr key={p.id}><td>{p.image_url && <img src={`http://localhost:5000${p.image_url}`} width="40" />}</td><td>{p.name}</td><td>${p.price}</td><td>{p.stock}</td><td><button onClick={() => edit(p)}>Edit</button><button onClick={async () => { await api.delete(`/products/${p.id}`); notify('Deleted'); load(); }}>Delete</button></td></tr>)}
      </tbody></table>
    </div>
  );
}
