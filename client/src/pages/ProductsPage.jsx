import { useEffect, useState } from 'react';
import api from '../api/http';
import { useApp } from '../context/AppContext';

const empty = { title: '', description: '', price: '', stock: '', category: '', image: null };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const { notify, t } = useApp();

  const load = () => api.get('/products', { params: { search } }).then(({ data }) => setProducts(data));
  useEffect(() => { load(); }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== null && fd.append(k, v));
    if (editing) await api.put(`/products/${editing}`, fd);
    else await api.post('/products', fd);
    setForm(empty); setEditing(null); load(); notify('Product saved', 'success');
  };

  return (
    <div>
      <h1>{t.products}</h1>
      <input className="glass" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
      <form className="glass form" onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
        <button>{editing ? 'Update' : 'Add'} Product</button>
      </form>
      <div className="glass table-wrap">
        <table><thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Stock</th><th /></tr></thead><tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.image_url && <img src={`http://localhost:5000${p.image_url}`} alt="p" className="thumb" />}</td>
              <td>{p.title}</td><td>${p.price}</td><td>{p.stock}</td>
              <td>
                <button onClick={() => { setEditing(p.id); setForm({ ...p, image: null }); }}>Edit</button>
                <button onClick={async () => { await api.delete(`/products/${p.id}`); load(); notify('Product deleted', 'warning'); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
