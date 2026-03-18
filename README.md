# 🐠 AquaAdmin — React Frontend

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000/api
npm run dev
```

## Routing

| Path | Description |
|------|-------------|
| `/` | Login / Register (index page) |
| `/dashboard` | Main dashboard (protected) |
| `/products` | Products list (protected) |
| `/orders` | Orders list (protected) |
| `/customers` | Customers (protected) |
| `/categories` | Categories (protected) |
| `/settings` | Settings (protected) |

## Auth Flow
1. User lands on `/` (registration/login page)
2. On successful login → redirected to `/dashboard`
3. All `/dashboard`, `/products`, etc. are protected — unauthenticated users are redirected to `/`
4. Token stored in `localStorage`; 401 responses auto-redirect to `/`
