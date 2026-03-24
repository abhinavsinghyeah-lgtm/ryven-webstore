const { query } = require("../config/db");

const getStoreSettings = async () => {
  const sql = `
    SELECT
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      tagline,
      updated_at AS "updatedAt"
    FROM store_settings
    WHERE id = 1
    LIMIT 1
  `;

  const result = await query(sql);
  return result.rows[0] || null;
};

const updateStoreSettings = async ({ storeName, logoUrl, tagline }) => {
  const sql = `
    UPDATE store_settings
    SET store_name = $1, logo_url = $2, tagline = $3, updated_at = NOW()
    WHERE id = 1
    RETURNING
      id,
      store_name AS "storeName",
      logo_url AS "logoUrl",
      tagline,
      updated_at AS "updatedAt"
  `;

  const result = await query(sql, [storeName, logoUrl, tagline]);
  return result.rows[0] || null;
};

module.exports = { getStoreSettings, updateStoreSettings };
