CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_settings (
  id SMALLINT PRIMARY KEY,
  store_name VARCHAR(80) NOT NULL,
  logo_url TEXT NOT NULL,
  tagline VARCHAR(120) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO store_settings (id, store_name, logo_url, tagline)
VALUES (
  1,
  'RYVEN',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop',
  'Scent with edge.'
)
ON CONFLICT (id) DO NOTHING;
