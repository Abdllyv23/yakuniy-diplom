# Seller Admin Panel (Production-Ready Full Stack)

Full-stack seller admin panel with:
- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Database:** PostgreSQL
- **Auth:** JWT
- **UI:** Glassmorphism dashboard with dark/light mode

## Features
- Admin registration and login
- Product CRUD with image upload
- User management (CRUD + status)
- Order management and status updates
- Dashboard analytics and notifications
- Settings (theme/language/background image)
- Multi-language UI: English / Russian / Uzbek
- Search and filter in core lists
- Responsive mobile + desktop layout

## Project Structure

```
seller-admin-panel/
├── client/                # React + Vite frontend
├── server/                # Express API + PostgreSQL logic
│   ├── src/
│   └── uploads/           # Uploaded product/background images
├── package.json           # Root workspace scripts
└── README.md
```

## 1) Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 13+

## 2) Database Setup
Create database and user (example):

```sql
CREATE DATABASE seller_admin;
```

Then configure `server/.env` from template:

```bash
cp server/.env.example server/.env
```

Update DB credentials if needed.

## 3) Install Dependencies
From project root:

```bash
npm install
```

## 4) Start Development (API + Frontend)
From project root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

The backend initializes the PostgreSQL schema automatically at startup.

## 5) Production Build
```bash
npm run build
npm run start
```

## Notes
- Uploads are served from `/uploads`.
- JWT token is stored in browser localStorage.
- For production deployment, put backend/frontend behind HTTPS reverse proxy and configure environment secrets.
