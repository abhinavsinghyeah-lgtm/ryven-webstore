-- ================================================================
-- 013: Delete old placeholder products, seed 6 real RYVEN products
-- ================================================================

-- Clean up old placeholders (remove from cart_items and collection_products first)
DELETE FROM cart_items WHERE product_id IN (SELECT id FROM products WHERE slug IN ('ryven-static-bloom', 'ryven-night-pulse', 'ryven-salt-veil'));
DELETE FROM collection_products WHERE product_id IN (SELECT id FROM products WHERE slug IN ('ryven-static-bloom', 'ryven-night-pulse', 'ryven-salt-veil'));
DELETE FROM order_items WHERE product_id IN (SELECT id FROM products WHERE slug IN ('ryven-static-bloom', 'ryven-night-pulse', 'ryven-salt-veil'));
DELETE FROM products WHERE slug IN ('ryven-static-bloom', 'ryven-night-pulse', 'ryven-salt-veil');

-- Seed 6 real products
INSERT INTO products (name, slug, short_description, description, price_paise, currency, image_url, notes, category, is_active)
VALUES
  (
    'Noir Velvet',
    'noir-velvet',
    'A dark, magnetic fragrance for those who command attention without saying a word.',
    'Noir Velvet opens with a burst of black orchid and spiced saffron, settling into a deep heart of oud wood and suede. The dry-down reveals smoky vanilla, dark amber, and a whisper of incense that lingers for hours. Best worn on cool evenings, date nights, and moments that matter. EDP concentration ensures 8-12 hours of projection.',
    374900,
    'INR',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
    ARRAY['Black Orchid', 'Oud Wood', 'Dark Vanilla', 'Saffron', 'Incense'],
    'Woody',
    TRUE
  ),
  (
    'Rose Absolue',
    'rose-absolue',
    'An elegant rose-forward scent with dewy petals and a graceful musk finish.',
    'Rose Absolue captures the first light of a garden at dawn. Opening with Bulgarian rose and dewy petals, the heart reveals white peony and pink pepper. A velvety base of white musk and sheer sandalwood gives it lasting sophistication. Perfect for day events, brunches, and spring wardrobes. Unisex appeal with 6-8 hours of wear.',
    299900,
    'INR',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
    ARRAY['Damask Rose', 'White Peony', 'Pink Pepper', 'White Musk', 'Sandalwood'],
    'Floral',
    TRUE
  ),
  (
    'Cedar Smoke',
    'cedar-smoke',
    'A campfire evening captured in a bottle — rugged, warm, and unforgettable.',
    'Cedar Smoke is built for the adventurer. It opens with crisp bergamot and juniper berries, then deepens into a heart of Atlas cedarwood and birch tar. The base is pure warmth: amber, vetiver, and a hint of leather. This is the scent of mountain lodges and starlit bonfires. Expect 8-10 hours of strong performance.',
    249900,
    'INR',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    ARRAY['Cedarwood', 'Birch Tar', 'Amber', 'Bergamot', 'Vetiver'],
    'Woody',
    TRUE
  ),
  (
    'Ocean Drift',
    'ocean-drift',
    'Crisp sea breeze meets bergamot and driftwood — built for hot summer days.',
    'Ocean Drift is pure coastal energy. A bright opening of sea salt, bergamot, and green apple gives way to a watery heart of lotus and marine accord. The base of driftwood and white amber keeps it grounded and masculine. Your new gym, beach, and everyday summer fragrance. Light enough for office wear with 5-7 hours of wear.',
    199900,
    'INR',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    ARRAY['Sea Salt', 'Bergamot', 'Driftwood', 'Lotus', 'White Amber'],
    'Fresh',
    TRUE
  ),
  (
    'Amber Nights',
    'amber-nights',
    'Rich amber, saffron threads, and tonka bean — a warm evening in a bottle.',
    'Amber Nights is pure opulence. Opening with Iranian saffron and cardamom, the heart blooms with rich amber resin and dried fruits. The base is a luxurious blend of tonka bean, benzoin, and a touch of oud. This is your celebration scent — weddings, parties, and special occasions. Expect 10+ hours of beastly performance.',
    329900,
    'INR',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop',
    ARRAY['Amber', 'Saffron', 'Tonka Bean', 'Cardamom', 'Benzoin'],
    'Oriental',
    TRUE
  ),
  (
    'White Tea',
    'white-tea',
    'Minimalist and calming — white tea leaves, soft linen, and a whisper of jasmine.',
    'White Tea is RYVEN''s cleanest scent. Imagine freshly laundered linen drying in a sunlit garden of jasmine and green tea. The opening is crisp white tea and bergamot, the heart is sheer jasmine and lily of the valley, and the base is soft cedar and clean musk. Universally flattering with 5-6 hours of soft, skin-close wear.',
    149900,
    'INR',
    'https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=800&auto=format&fit=crop',
    ARRAY['White Tea', 'Jasmine', 'Soft Linen', 'Bergamot', 'Clean Musk'],
    'Fresh',
    TRUE
  );
