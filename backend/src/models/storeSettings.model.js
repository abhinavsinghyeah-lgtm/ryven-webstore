const { query } = require("../config/db");

const getStoreSettings = async () => {
  const sql = `
    SELECT
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      logo_width_px AS "logoWidthPx",
      logo_height_px AS "logoHeightPx",
      hero_image_url AS "heroImageUrl",
      theme_config AS "themeConfig",
      auth_background_url AS "authBackgroundUrl",
      auth_background_color AS "authBackgroundColor",
      tagline,
      updated_at AS "updatedAt"
    FROM store_settings
    WHERE id = 1
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
};

const updateStoreSettings = async ({
  storeName,
  logoUrl,
  logoWidthPx,
  logoHeightPx,
  heroImageUrl,
  tagline,
  authBackgroundUrl,
  authBackgroundColor,
}) => {
  const sql = `
    UPDATE store_settings
    SET store_name = $1,
        logo_url = $2,
        logo_width_px = $3,
        logo_height_px = $4,
        hero_image_url = $5,
        auth_background_url = $6,
        auth_background_color = $7,
        tagline = $8,
        updated_at = NOW()
    WHERE id = 1
    RETURNING
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      logo_width_px AS "logoWidthPx",
      logo_height_px AS "logoHeightPx",
      hero_image_url AS "heroImageUrl",
      auth_background_url AS "authBackgroundUrl",
      auth_background_color AS "authBackgroundColor",
      tagline,
      updated_at AS "updatedAt"
  `;

  const result = await query(sql, [
    storeName,
    logoUrl,
    logoWidthPx,
    logoHeightPx,
    heroImageUrl || logoUrl,
    authBackgroundUrl || null,
    authBackgroundColor || null,
    tagline,
  ]);
  return result.rows[0] || null;
};

const updateThemeConfig = async ({ themeConfig }) => {
  const sql = `
    UPDATE store_settings
    SET theme_config = $1,
        updated_at = NOW()
    WHERE id = 1
    RETURNING
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      logo_width_px AS "logoWidthPx",
      logo_height_px AS "logoHeightPx",
      hero_image_url AS "heroImageUrl",
      theme_config AS "themeConfig",
      auth_background_url AS "authBackgroundUrl",
      auth_background_color AS "authBackgroundColor",
      tagline,
      updated_at AS "updatedAt"
  `;

  const result = await query(sql, [JSON.stringify(themeConfig)]);
  return result.rows[0] || null;
};

module.exports = { getStoreSettings, updateStoreSettings, updateThemeConfig };
