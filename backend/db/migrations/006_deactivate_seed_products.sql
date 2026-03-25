UPDATE products
SET is_active = FALSE, updated_at = NOW()
WHERE slug IN ('ryven-static-bloom', 'ryven-night-pulse', 'ryven-salt-veil');
