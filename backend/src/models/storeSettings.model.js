const { query } = require("../config/db");

const getStoreSettings = async () => {
  const sql = `
    SELECT
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      hero_image_url AS "heroImageUrl",
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

const updateStoreSettings = async ({ storeName, logoUrl, heroImageUrl, tagline, authBackgroundUrl, authBackgroundColor }) => {
  const sql = `
    UPDATE store_settings
    SET store_name = $1,
        logo_url = $2,
        hero_image_url = $3,
        auth_background_url = $4,
        auth_background_color = $5,
        tagline = $6,
        updated_at = NOW()
    WHERE id = 1
    RETURNING
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      hero_image_url AS "heroImageUrl",
      auth_background_url AS "authBackgroundUrl",
      auth_background_color AS "authBackgroundColor",
      tagline,
      updated_at AS "updatedAt"
  `;

  const result = await query(sql, [
    storeName,
    logoUrl,
    heroImageUrl || logoUrl,
    authBackgroundUrl || null,
    authBackgroundColor || null,
    tagline,
  ]);
  return result.rows[0] || null;
};

module.exports = { getStoreSettings, updateStoreSettings };
