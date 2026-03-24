# RYVEN Backend API

## Run on Ubuntu VPS

1. Copy `.env.example` to `.env` and fill values.
2. Run `npm install`.
3. Apply SQL from `db/migrations/001_init.sql` to PostgreSQL.
4. Start dev: `npm run dev`.
5. Start prod: `npm run start` or `pm2 start ecosystem.config.js`.

## API (Feature 1)

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token required)
- `GET /api/v1/public/store-settings`
- `PUT /api/v1/admin/store-settings` (admin only)

## API (Feature 2)

- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `POST /api/v1/admin/products` (admin only)
- `PUT /api/v1/admin/products/:id` (admin only)
