import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', role = '', status = '' } = req.query;
  const result = await pool.query(
    `SELECT * FROM users
     WHERE ($1 = '' OR LOWER(full_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
       AND ($2 = '' OR LOWER(role) = LOWER($2))
       AND ($3 = '' OR LOWER(status) = LOWER($3))
     ORDER BY created_at DESC`,
    [`%${search}%`, role, status]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { fullName, email, role, status } = req.body;
  const result = await pool.query(
    `INSERT INTO users (full_name, email, role, status)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [fullName, email, role || 'customer', status || 'active']
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { fullName, email, role, status } = req.body;
  const result = await pool.query(
    `UPDATE users SET
      full_name = COALESCE($1, full_name),
      email = COALESCE($2, email),
      role = COALESCE($3, role),
      status = COALESCE($4, status)
      WHERE id = $5 RETURNING *`,
    [fullName, email, role, status, req.params.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'User removed' });
});

export default router;
