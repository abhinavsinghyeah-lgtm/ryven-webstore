# Feature 02: Products

## Delivered

- Public catalog endpoint with pagination and search
- Product detail endpoint by slug
- Admin product create/update endpoints
- Frontend product listing page
- Frontend product detail page

## API

- `GET /api/v1/products?q=&page=&limit=`
- `GET /api/v1/products/:slug`
- `POST /api/v1/admin/products`
- `PUT /api/v1/admin/products/:id`

## Data model

- Product includes name, slug, short/long description, price in paise, category, notes, image URL, active flag.
- All SQL is parameterized.

## Security and quality

- Zod request validation
- Admin route protection (JWT + role)
- Basic text sanitization before persistence
