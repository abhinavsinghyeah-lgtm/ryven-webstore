# Ubuntu VPS Deployment Guide

## 1) System packages

```bash
sudo apt update
sudo apt install -y git curl build-essential postgresql postgresql-contrib nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2) PostgreSQL setup

```bash
sudo -u postgres psql
CREATE DATABASE ryven_webstore;
CREATE USER ryven_user WITH ENCRYPTED PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE ryven_webstore TO ryven_user;
\q
```

Apply migration:

```bash
psql -h 127.0.0.1 -U ryven_user -d ryven_webstore -f backend/db/migrations/001_init.sql
```

## 3) Backend deploy

```bash
cd backend
cp .env.example .env
# edit .env with production values
npm ci
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4) Frontend deploy

```bash
cd frontend
cp .env.example .env.local
# edit API base URL
npm ci
npm run build
pm2 start npm --name ryven-frontend -- start
```

## 5) Nginx reverse proxy (example)

- Route API host to backend port (5000)
- Route web host to frontend port (3000)
- Enable HTTPS with certbot

## 6) Notes

- Keep secrets only in environment variables.
- Never commit `.env` files.
- Use `pm2 logs` for debugging.
