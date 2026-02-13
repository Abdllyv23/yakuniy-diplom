import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRequired } from './middleware/auth.js';
import { initializeDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', authRequired, productRoutes);
app.use('/api/orders', authRequired, orderRoutes);
app.use('/api/users', authRequired, userRoutes);
app.use('/api/dashboard', authRequired, dashboardRoutes);
app.use('/api/settings', authRequired, settingsRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: 'Server error' });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Database init failed', err);
    process.exit(1);
  });
