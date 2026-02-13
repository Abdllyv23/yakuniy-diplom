import express from 'express';
import { pool } from '../config/db.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM admin_settings WHERE admin_id = $1', [req.admin.id]);
  res.json(result.rows[0] || null);
});

router.put('/', upload.single('backgroundImage'), async (req, res) => {
  const { theme, language } = req.body;
  const bgPath = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await pool.query(
    `INSERT INTO admin_settings (admin_id, theme, language, background_image, updated_at)
     VALUES ($1, COALESCE($2, 'dark'), COALESCE($3, 'en'), $4, NOW())
     ON CONFLICT (admin_id)
     DO UPDATE SET
      theme = COALESCE($2, admin_settings.theme),
      language = COALESCE($3, admin_settings.language),
      background_image = COALESCE($4, admin_settings.background_image),
      updated_at = NOW()
     RETURNING *`,
    [req.admin.id, theme, language, bgPath]
  );

  res.json(result.rows[0]);
});

export default router;
