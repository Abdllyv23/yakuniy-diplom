import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ message: 'Admin already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO admins (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, role`,
    [fullName, email, passwordHash]
  );

  const admin = result.rows[0];
  await pool.query('INSERT INTO admin_settings (admin_id) VALUES ($1) ON CONFLICT (admin_id) DO NOTHING', [admin.id]);

  return res.status(201).json({ admin });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
  if (result.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const admin = result.rows[0];
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return res.json({
    token,
    admin: {
      id: admin.id,
      fullName: admin.full_name,
      email: admin.email,
      role: admin.role
    }
  });
});

router.get('/me', authRequired, async (req, res) => {
  const result = await pool.query('SELECT id, full_name, email, role FROM admins WHERE id = $1', [req.admin.id]);
  return res.json(result.rows[0]);
});

export default router;
