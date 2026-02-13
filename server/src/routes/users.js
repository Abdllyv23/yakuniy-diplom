import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { search = '', status = '' } = req.query;
  const { rows } = await query(
    `SELECT * FROM users
      WHERE ($1='' OR LOWER(full_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
      AND ($2='' OR status=$2)
      ORDER BY created_at DESC`,
    [`%${search}%`, status],
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { fullName, email, phone = '', status = 'active' } = req.body;
  const { rows } = await query(
    `INSERT INTO users(full_name,email,phone,status) VALUES($1,$2,$3,$4) RETURNING *`,
    [fullName, email, phone, status],
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { fullName, email, phone = '', status = 'active' } = req.body;
  const { rows } = await query(
    `UPDATE users SET full_name=$1,email=$2,phone=$3,status=$4 WHERE id=$5 RETURNING *`,
    [fullName, email, phone, status, req.params.id],
  );
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM users WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

export default router;
