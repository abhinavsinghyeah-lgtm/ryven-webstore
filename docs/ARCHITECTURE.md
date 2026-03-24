# Architecture Overview

## Monorepo Layout

- `frontend`: Next.js app (UI only)
- `backend`: Express API (business logic + PostgreSQL)
- `docs`: technical documentation

## Separation Rules

- Frontend never accesses database directly.
- Backend never renders frontend UI.
- Communication only through HTTP API.

## Backend (MVC)

- `src/routes`: API endpoints and middleware composition
- `src/controllers`: request/response orchestration
- `src/services`: business logic
- `src/models`: PostgreSQL query layer
- `src/validators`: Zod schemas for every payload
- `src/middlewares`: auth, validation, security, error handling

## Security Baseline

- Helmet, rate limiting, HPP, CORS policy
- JWT-based access control
- Bcrypt password hashing
- Input validation before controller logic
- Admin endpoints protected with role checks

## Initial Domain Included

- Auth: signup, login, current user
- Store branding settings (public read, admin update)
