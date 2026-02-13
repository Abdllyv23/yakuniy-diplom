import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT theme, language, background_image FROM settings WHERE admin_id=$1', [req.admin.id]);
  res.json(rows[0] || { theme: 'dark', language: 'en', background_image: null });
});

router.put('/', async (req, res) => {
  const { theme, language } = req.body;
  const { rows } = await query(
    `INSERT INTO settings(admin_id,theme,language)
     VALUES($1,$2,$3)
     ON CONFLICT (admin_id) DO UPDATE SET theme=$2, language=$3, updated_at=NOW()
     RETURNING theme, language, background_image`,
    [req.admin.id, theme, language],
  );
  res.json(rows[0]);
});

router.post('/background', upload.single('image'), async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const { rows } = await query(
    `INSERT INTO settings(admin_id,background_image)
     VALUES($1,$2)
     ON CONFLICT (admin_id) DO UPDATE SET background_image=$2, updated_at=NOW()
     RETURNING theme, language, background_image`,
    [req.admin.id, imageUrl],
  );
  res.json(rows[0]);
});

export default router;
