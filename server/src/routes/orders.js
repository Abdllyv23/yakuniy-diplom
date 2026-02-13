import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { status = '', search = '' } = req.query;
  const { rows } = await query(
    `SELECT o.*, u.full_name, u.email
     FROM orders o
     LEFT JOIN users u ON u.id=o.user_id
     WHERE ($1='' OR o.status=$1)
       AND ($2='' OR CAST(o.id AS TEXT) LIKE $2 OR LOWER(u.full_name) LIKE LOWER($2))
     ORDER BY o.created_at DESC`,
    [status, `%${search}%`],
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { userId, items = [] } = req.body;
  if (!items.length) return res.status(400).json({ message: 'Order items required' });

  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const order = await query(
    'INSERT INTO orders(user_id,total_amount) VALUES($1,$2) RETURNING *',
    [userId || null, total],
  );

  // Persist order items as transactional details.
  for (const item of items) {
    await query(
      'INSERT INTO order_items(order_id,product_id,quantity,price) VALUES($1,$2,$3,$4)',
      [order.rows[0].id, item.productId, item.quantity, item.price],
    );
  }
  res.status(201).json(order.rows[0]);
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const { rows } = await query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  res.json(rows[0]);
});

router.get('/:id/items', async (req, res) => {
  const { rows } = await query(
    `SELECT oi.*, p.title, p.image_url FROM order_items oi
     LEFT JOIN products p ON p.id=oi.product_id
     WHERE oi.order_id=$1`,
    [req.params.id],
  );
  res.json(rows);
});

export default router;
