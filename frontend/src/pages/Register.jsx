import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { register } = useAuth();
  const { notify } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      notify('Registration complete. Please login.');
      nav('/login');
    } catch {
      notify('Registration failed', 'error');
    }
  };

  return (
    <div className="auth-page">
      <form className="glass auth-form" onSubmit={submit}>
        <h2>Admin Registration</h2>
        <input placeholder="Full Name" required onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>Register</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
