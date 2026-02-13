import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/stats', async (_req, res) => {
  const [products, orders, users, revenue, recentOrders] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM products'),
    pool.query('SELECT COUNT(*)::int AS count FROM orders'),
    pool.query('SELECT COUNT(*)::int AS count FROM users'),
    pool.query("SELECT COALESCE(SUM(total),0)::numeric(12,2) AS total FROM orders WHERE payment_status = 'paid'"),
    pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5')
  ]);

  res.json({
    counts: {
      products: products.rows[0].count,
      orders: orders.rows[0].count,
      users: users.rows[0].count
    },
    revenue: revenue.rows[0].total,
    recentOrders: recentOrders.rows
  });
});

export default router;
