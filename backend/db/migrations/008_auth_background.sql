ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS auth_background_url TEXT,
  ADD COLUMN IF NOT EXISTS auth_background_color TEXT;

UPDATE store_settings
SET auth_background_color = '#f4f4f5'
WHERE id = 1 AND auth_background_color IS NULL;
