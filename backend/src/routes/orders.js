import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', status = '' } = req.query;
  const result = await pool.query(
    `SELECT * FROM orders
     WHERE ($1 = '' OR LOWER(customer_name) LIKE LOWER($1) OR LOWER(customer_email) LIKE LOWER($1))
       AND ($2 = '' OR LOWER(status) = LOWER($2))
     ORDER BY created_at DESC`,
    [`%${search}%`, status]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { customerName, customerEmail, total, status, paymentStatus } = req.body;
  const result = await pool.query(
    `INSERT INTO orders (customer_name, customer_email, total, status, payment_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customerName, customerEmail, Number(total), status || 'pending', paymentStatus || 'unpaid']
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { status, paymentStatus } = req.body;
  const result = await pool.query(
    `UPDATE orders
     SET status = COALESCE($1, status), payment_status = COALESCE($2, payment_status)
     WHERE id = $3 RETURNING *`,
    [status, paymentStatus, req.params.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
  res.json({ message: 'Order removed' });
});

export default router;
