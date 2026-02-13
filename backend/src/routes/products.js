import express from 'express';
import { pool } from '../config/db.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', category = '' } = req.query;
  const result = await pool.query(
    `SELECT * FROM products
     WHERE ($1 = '' OR LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
       AND ($2 = '' OR LOWER(category) = LOWER($2))
     ORDER BY created_at DESC`,
    [`%${search}%`, category]
  );
  res.json(result.rows);
});

router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, category, image_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description || '', Number(price), Number(stock), category, imageUrl]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (existing.rowCount === 0) return res.status(404).json({ message: 'Product not found' });

  const current = existing.rows[0];
  const { name, description, price, stock, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : current.image_url;

  const result = await pool.query(
    `UPDATE products SET
      name = $1,
      description = $2,
      price = $3,
      stock = $4,
      category = $5,
      image_url = $6,
      updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [name ?? current.name, description ?? current.description, Number(price ?? current.price), Number(stock ?? current.stock), category ?? current.category, imageUrl, id]
  );

  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.json({ message: 'Product removed' });
});

export default router;
