CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  short_description VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price_paise INTEGER NOT NULL CHECK (price_paise > 0),
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  image_url TEXT NOT NULL,
  notes TEXT[] NOT NULL DEFAULT '{}',
  category VARCHAR(60) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

INSERT INTO products (name, slug, short_description, description, price_paise, currency, image_url, notes, category, is_active)
VALUES
  (
    'RYVEN Static Bloom',
    'ryven-static-bloom',
    'A bright mineral-floral built for long city days.',
    'Static Bloom opens with neroli and green mandarin, shifts into iris steel, and settles into dry musk with soft amber woods.',
    499900,
    'INR',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop',
    ARRAY['Neroli', 'Iris', 'Musk'],
    'Floral',
    TRUE
  ),
  (
    'RYVEN Night Pulse',
    'ryven-night-pulse',
    'Smoky citrus with an electric cedar base.',
    'Night Pulse starts with bitter orange and black pepper, then moves into smoky incense and polished cedar for a crisp, nocturnal profile.',
    579900,
    'INR',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
    ARRAY['Orange', 'Incense', 'Cedar'],
    'Woody',
    TRUE
  ),
  (
    'RYVEN Salt Veil',
    'ryven-salt-veil',
    'Transparent marine accord layered with white tea.',
    'Salt Veil delivers airy sea salt and white tea, wrapped in clean sandalwood for an everyday understated signature.',
    459900,
    'INR',
    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop',
    ARRAY['Sea Salt', 'White Tea', 'Sandalwood'],
    'Fresh',
    TRUE
  );
