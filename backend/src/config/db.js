import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD ?? '123456'),
  database: process.env.DB_NAME || 'seller_admin'
});

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Core admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Platform users managed by admin panel
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'customer',
        status VARCHAR(30) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Product catalog
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(160) NOT NULL,
        description TEXT,
        price NUMERIC(12,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Orders for management dashboard
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(120) NOT NULL,
        customer_email VARCHAR(120) NOT NULL,
        total NUMERIC(12,2) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Per-admin panel preferences
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER UNIQUE REFERENCES admins(id) ON DELETE CASCADE,
        theme VARCHAR(20) NOT NULL DEFAULT 'dark',
        language VARCHAR(5) NOT NULL DEFAULT 'en',
        background_image TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
