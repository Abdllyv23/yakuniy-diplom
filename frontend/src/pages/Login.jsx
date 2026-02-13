import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useAuth();
  const { notify } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      notify('Login successful');
      nav('/');
    } catch {
      notify('Invalid credentials', 'error');
    }
  };

  return (
    <div className="auth-page">
      <form className="glass auth-form" onSubmit={submit}>
        <h2>Admin Login</h2>
        <input placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>Login</button>
        <p>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
