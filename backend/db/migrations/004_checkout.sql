-- Extend users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(15);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_password_set BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',

  -- Address snapshot
  shipping_name VARCHAR(80) NOT NULL,
  shipping_phone VARCHAR(15) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(60) NOT NULL,
  shipping_state VARCHAR(60) NOT NULL,
  shipping_pincode VARCHAR(10) NOT NULL,
  shipping_country VARCHAR(60) NOT NULL DEFAULT 'India',

  -- Amounts computed server-side
  subtotal_paise INTEGER NOT NULL,
  shipping_paise INTEGER NOT NULL DEFAULT 0,
  total_paise INTEGER NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',

  -- Razorpay
  razorpay_order_id VARCHAR(100) UNIQUE,
  razorpay_payment_id VARCHAR(100),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(120) NOT NULL,
  product_image_url TEXT NOT NULL,
  unit_price_paise INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  line_total_paise INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
