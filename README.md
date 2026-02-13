# Seller Admin Panel

Production-ready full-stack Seller Admin Panel built with **Node.js + Express**, **React + Vite**, and **PostgreSQL**.

## Features
- JWT-based admin authentication (register/login)
- Dashboard analytics
- Product management (CRUD + image upload)
- Order management (list/search/filter/status update/delete)
- User management (list/search/filter/role/status update/delete)
- Settings management (theme + background image upload)
- Multi-language UI (English, Uzbek, Russian)
- Responsive modern glassmorphism interface with dark/light mode
- Global notifications/alerts

## Tech Stack
- Backend: Express, PostgreSQL (`pg`), JWT, Multer
- Frontend: React, Vite, React Router, i18next

## Prerequisites
- Node.js 20+
- PostgreSQL 14+

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create database, for example:
   ```sql
   CREATE DATABASE seller_admin;
   ```
3. Configure backend environment:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Update DB credentials and JWT secret.

## Run (Development)
From project root:
```bash
npm run dev
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Production build
```bash
npm run build
```

## API health
`GET http://localhost:5000/api/health`

## Default behavior
On first backend startup, tables are auto-created if missing.
