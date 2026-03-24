# Feature 01: Authentication

## Delivered

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- Frontend signup and login pages
- Token persistence in browser storage

## Security controls

- Passwords hashed with bcrypt (cost 12)
- JWT signed with secret from env
- Zod validation for request payloads
- Generic invalid-credentials errors

## Admin brand settings

- `GET /api/v1/public/store-settings`
- `PUT /api/v1/admin/store-settings` (admin role only)

This ensures webstore name/logo/tagline are centralized in admin-managed settings.
