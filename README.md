# Seller Admin Panel

Full-stack Seller Admin Panel built with **Node.js + Express**, **React + Vite**, and **PostgreSQL**.

## Features
- JWT-based admin authentication (register/login)
- Dashboard analytics
- Product management (CRUD + image upload)
- Order management (list/search/filter/status update/delete)
- User management (list/search/filter/role/status update/delete)
- Settings management (theme + background image upload)

## Tech Stack
- Backend: Express, PostgreSQL (`pg`), JWT, Multer
- Frontend: React, Vite, React Router, i18next

## Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)

## Environment files
Create env files from examples before starting:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### `backend/.env` variables
- `PORT` (default `5000`)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- OR use `DATABASE_URL` instead of PG* variables
- `JWT_SECRET`
- `CORS_ORIGIN` (frontend URL, default `http://localhost:5173`)

### `frontend/.env` variables
- `VITE_API_BASE_URL` (default `http://localhost:5000`)

## Local setup (step-by-step)
1. Copy env file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Fill database password in `backend/.env` (`PGPASSWORD=...`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start backend:
   ```bash
   npm run dev -w backend
   ```
5. Install frontend deps (already installed if step 3 was run):
   ```bash
   npm install -w frontend
   ```
6. Start frontend:
   ```bash
   npm run dev -w frontend
   ```
7. Open `http://localhost:5173`.
8. Test registration/login from `/register` and `/login`.
9. Test health endpoint: `http://localhost:5000/api/health`.

## Optional: start PostgreSQL with Docker Compose
If you do not have local PostgreSQL:

```bash
docker compose up -d postgres
```

Default Docker DB credentials:
- host: `localhost`
- port: `5432`
- database: `seller_admin`
- user: `postgres`
- password: `postgres`

Update `backend/.env` to match these values.

## Run both apps from project root
```bash
npm run dev
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Health check
```bash
curl http://localhost:5000/api/health
```
