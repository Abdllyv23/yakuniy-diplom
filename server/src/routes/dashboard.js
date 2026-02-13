import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/stats', async (_req, res) => {
  const [users, products, orders, revenue, monthly] = await Promise.all([
    query('SELECT COUNT(*)::int AS total FROM users'),
    query('SELECT COUNT(*)::int AS total FROM products'),
    query('SELECT COUNT(*)::int AS total FROM orders'),
    query("SELECT COALESCE(SUM(total_amount),0)::float AS total FROM orders WHERE status IN ('paid','shipped','delivered')"),
    query(`SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COALESCE(SUM(total_amount),0)::float AS revenue
           FROM orders GROUP BY 1 ORDER BY 1 DESC LIMIT 6`),
  ]);

  res.json({
    users: users.rows[0].total,
    products: products.rows[0].total,
    orders: orders.rows[0].total,
    revenue: revenue.rows[0].total,
    monthlyRevenue: monthly.rows.reverse(),
  });
});

router.get('/notifications', async (_req, res) => {
  const lowStock = await query('SELECT title, stock FROM products WHERE stock < 5 ORDER BY stock ASC LIMIT 5');
  const pendingOrders = await query("SELECT id, created_at FROM orders WHERE status='pending' ORDER BY created_at DESC LIMIT 5");

  const notifications = [
    ...lowStock.rows.map((item) => ({ type: 'warning', message: `${item.title} is low in stock (${item.stock})` })),
    ...pendingOrders.rows.map((order) => ({ type: 'info', message: `Order #${order.id} is pending` })),
  ];

  res.json(notifications);
});

export default router;
