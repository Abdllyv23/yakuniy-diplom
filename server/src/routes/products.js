import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { search = '', category = '' } = req.query;
  const { rows } = await query(
    `SELECT * FROM products
     WHERE ($1='' OR LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
       AND ($2='' OR category=$2)
     ORDER BY created_at DESC`,
    [`%${search}%`, category],
  );
  res.json(rows);
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description = '', price, stock = 0, category = '' } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const { rows } = await query(
    `INSERT INTO products(title,description,price,stock,image_url,category)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, Number(price), Number(stock), imageUrl, category],
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const current = await query('SELECT image_url FROM products WHERE id=$1', [id]);
  if (!current.rowCount) return res.status(404).json({ message: 'Not found' });

  const { title, description = '', price, stock = 0, category = '' } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : current.rows[0].image_url;
  const { rows } = await query(
    `UPDATE products SET title=$1,description=$2,price=$3,stock=$4,image_url=$5,category=$6,updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [title, description, Number(price), Number(stock), imageUrl, category, id],
  );
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM products WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

export default router;
