ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

UPDATE store_settings
SET hero_image_url = COALESCE(hero_image_url, logo_url)
WHERE id = 1;

ALTER TABLE store_settings
ALTER COLUMN hero_image_url SET NOT NULL;
