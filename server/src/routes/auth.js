import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const existing = await query('SELECT id FROM admins WHERE email=$1', [email]);
  if (existing.rowCount) return res.status(409).json({ message: 'Email already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    'INSERT INTO admins(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email',
    [name, email, passwordHash],
  );
  await query('INSERT INTO settings(admin_id) VALUES($1) ON CONFLICT (admin_id) DO NOTHING', [rows[0].id]);
  const token = signToken({ id: rows[0].id, email: rows[0].email });
  return res.status(201).json({ token, admin: rows[0] });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query('SELECT * FROM admins WHERE email=$1', [email]);
  if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: rows[0].id, email: rows[0].email });
  return res.json({ token, admin: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
});

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT id,name,email,created_at FROM admins WHERE id=$1', [req.admin.id]);
  return res.json(rows[0]);
});

export default router;
