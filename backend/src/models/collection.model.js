const { query } = require("../config/db");

const baseSelect = `
  SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.image_url AS "imageUrl",
    c.is_active AS "isActive",
    c.featured_on_home AS "featuredOnHome",
    c.home_position AS "homePosition",
    c.created_at AS "createdAt",
    c.updated_at AS "updatedAt",
    COUNT(cp.product_id)::int AS "productCount"
  FROM collections c
  LEFT JOIN collection_products cp ON cp.collection_id = c.id
`;

const listCollections = async ({ onlyActive = true, featuredOnly = false, limit = 50, offset = 0 }) => {
  const conditions = [];
  if (onlyActive) conditions.push("c.is_active = TRUE");
  if (featuredOnly) conditions.push("c.featured_on_home = TRUE");
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
    ${baseSelect}
    ${where}
    GROUP BY c.id
    ORDER BY c.home_position ASC, c.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await query(sql, [limit, offset]);
  return result.rows;
};

const countCollections = async ({ onlyActive = true, featuredOnly = false }) => {
  const conditions = [];
  if (onlyActive) conditions.push("is_active = TRUE");
  if (featuredOnly) conditions.push("featured_on_home = TRUE");
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await query(`SELECT COUNT(*)::int AS total FROM collections ${where}`);
  return result.rows[0].total;
};

const findCollectionBySlug = async (slug) => {
  const sql = `
    ${baseSelect}
    WHERE c.slug = $1 AND c.is_active = TRUE
    GROUP BY c.id
    LIMIT 1
  `;
  const result = await query(sql, [slug]);
  return result.rows[0] || null;
};

const findCollectionById = async (id) => {
  const sql = `
    ${baseSelect}
    WHERE c.id = $1
    GROUP BY c.id
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const listProductsForCollection = async (collectionId) => {
  const sql = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.short_description AS "shortDescription",
      p.description,
      p.price_paise AS "pricePaise",
      p.currency,
      p.image_url AS "imageUrl",
      p.notes,
      p.category,
      p.is_active AS "isActive",
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt"
    FROM collection_products cp
    INNER JOIN products p ON p.id = cp.product_id
    WHERE cp.collection_id = $1 AND p.is_active = TRUE
    ORDER BY p.created_at DESC
  `;
  const result = await query(sql, [collectionId]);
  return result.rows;
};

const listCollectionProductIds = async (collectionId) => {
  const result = await query("SELECT product_id AS id FROM collection_products WHERE collection_id = $1 ORDER BY product_id", [collectionId]);
  return result.rows.map((row) => row.id);
};

const createCollection = async ({ name, slug, description, imageUrl, featuredOnHome, homePosition }) => {
  const sql = `
    INSERT INTO collections (name, slug, description, image_url, featured_on_home, home_position)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      name,
      slug,
      description,
      image_url AS "imageUrl",
      is_active AS "isActive",
      featured_on_home AS "featuredOnHome",
      home_position AS "homePosition",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;
  const result = await query(sql, [name, slug, description, imageUrl, featuredOnHome, homePosition]);
  return result.rows[0];
};

const updateCollectionById = async (id, { name, slug, description, imageUrl, featuredOnHome, homePosition, isActive }) => {
  const sql = `
    UPDATE collections
    SET name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        featured_on_home = $5,
        home_position = $6,
        is_active = $7,
        updated_at = NOW()
    WHERE id = $8
    RETURNING
      id,
      name,
      slug,
      description,
      image_url AS "imageUrl",
      is_active AS "isActive",
      featured_on_home AS "featuredOnHome",
      home_position AS "homePosition",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;
  const result = await query(sql, [name, slug, description, imageUrl, featuredOnHome, homePosition, isActive, id]);
  return result.rows[0] || null;
};

const deleteCollectionById = async (id) => {
  const result = await query(
    `UPDATE collections
     SET is_active = FALSE, featured_on_home = FALSE, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [id],
  );
  return result.rows[0] || null;
};

const replaceCollectionProducts = async (collectionId, productIds) => {
  await query("DELETE FROM collection_products WHERE collection_id = $1", [collectionId]);
  if (!productIds.length) return;
  const values = [];
  const placeholders = [];
  productIds.forEach((productId, index) => {
    const base = index * 2;
    placeholders.push(`($${base + 1}, $${base + 2})`);
    values.push(collectionId, productId);
  });
  await query(`INSERT INTO collection_products (collection_id, product_id) VALUES ${placeholders.join(", ")}`, values);
};

module.exports = {
  listCollections,
  countCollections,
  findCollectionBySlug,
  findCollectionById,
  listProductsForCollection,
  listCollectionProductIds,
  createCollection,
  updateCollectionById,
  deleteCollectionById,
  replaceCollectionProducts,
};
