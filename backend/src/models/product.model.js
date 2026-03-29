const { query } = require("../config/db");

const productSelect = `
  SELECT
    id,
    name,
    slug,
    short_description AS "shortDescription",
    description,
    price_paise AS "pricePaise",
    currency,
    image_url AS "imageUrl",
    notes,
    category,
    is_active AS "isActive",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM products
`;

const listProducts = async ({ search, limit, offset }) => {
  const where = search ? "WHERE is_active = TRUE AND (name ILIKE $1 OR category ILIKE $1)" : "WHERE is_active = TRUE";
  const values = search ? [`%${search}%`, limit, offset] : [limit, offset];
  const limitOffset = search ? "LIMIT $2 OFFSET $3" : "LIMIT $1 OFFSET $2";

  const sql = `${productSelect} ${where} ORDER BY created_at DESC ${limitOffset}`;
  const result = await query(sql, values);
  return result.rows;
};

const listAdminProducts = async ({ search, limit, offset }) => {
  const where = search ? "WHERE (p.name ILIKE $1 OR p.category ILIKE $1 OR p.slug ILIKE $1)" : "";
  const values = search ? [`%${search}%`, limit, offset] : [limit, offset];
  const limitOffset = search ? "LIMIT $2 OFFSET $3" : "LIMIT $1 OFFSET $2";

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
      p.updated_at AS "updatedAt",
      COUNT(DISTINCT oi.order_id)::int AS "orderCount",
      COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
      COALESCE(SUM(oi.line_total_paise), 0)::int AS "revenuePaise",
      MAX(o.created_at) AS "lastOrderedAt"
    FROM products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    LEFT JOIN orders o ON o.id = oi.order_id
    ${where}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    ${limitOffset}
  `;

  const result = await query(sql, values);
  return result.rows;
};

const countProducts = async ({ search }) => {
  const sql = search
    ? "SELECT COUNT(*)::int AS total FROM products WHERE is_active = TRUE AND (name ILIKE $1 OR category ILIKE $1)"
    : "SELECT COUNT(*)::int AS total FROM products WHERE is_active = TRUE";

  const values = search ? [`%${search}%`] : [];
  const result = await query(sql, values);
  return result.rows[0].total;
};

const countAdminProducts = async ({ search }) => {
  const sql = search
    ? "SELECT COUNT(*)::int AS total FROM products WHERE name ILIKE $1 OR category ILIKE $1 OR slug ILIKE $1"
    : "SELECT COUNT(*)::int AS total FROM products";

  const values = search ? [`%${search}%`] : [];
  const result = await query(sql, values);
  return result.rows[0].total;
};

const findProductBySlug = async (slug) => {
  const sql = `${productSelect} WHERE slug = $1 AND is_active = TRUE LIMIT 1`;
  const result = await query(sql, [slug]);
  return result.rows[0] || null;
};

const findProductById = async (id) => {
  const sql = `${productSelect} WHERE id = $1 LIMIT 1`;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const getAdminProductDetail = async (id) => {
  const productSql = `
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
      p.updated_at AS "updatedAt",
      COUNT(DISTINCT oi.order_id)::int AS "orderCount",
      COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
      COALESCE(SUM(oi.line_total_paise), 0)::int AS "revenuePaise",
      MAX(o.created_at) AS "lastOrderedAt"
    FROM products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    LEFT JOIN orders o ON o.id = oi.order_id
    WHERE p.id = $1
    GROUP BY p.id
    LIMIT 1
  `;

  const ordersSql = `
    SELECT
      o.id AS "orderId",
      o.status,
      o.created_at AS "orderedAt",
      o.total_paise AS "orderTotalPaise",
      o.currency,
      oi.quantity,
      oi.unit_price_paise AS "unitPricePaise",
      oi.line_total_paise AS "lineTotalPaise",
      u.id AS "userId",
      u.full_name AS "fullName",
      u.email,
      u.phone
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    INNER JOIN users u ON u.id = o.user_id
    WHERE oi.product_id = $1
    ORDER BY o.created_at DESC
    LIMIT 100
  `;

  const [productResult, ordersResult] = await Promise.all([query(productSql, [id]), query(ordersSql, [id])]);
  if (!productResult.rows[0]) {
    return null;
  }

  return {
    ...productResult.rows[0],
    orderHistory: ordersResult.rows,
  };
};

const createProduct = async (payload) => {
  const sql = `
    INSERT INTO products (name, slug, short_description, description, price_paise, currency, image_url, notes, category, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
      id,
      name,
      slug,
      short_description AS "shortDescription",
      description,
      price_paise AS "pricePaise",
      currency,
      image_url AS "imageUrl",
      notes,
      category,
      is_active AS "isActive",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  const values = [
    payload.name,
    payload.slug,
    payload.shortDescription,
    payload.description,
    payload.pricePaise,
    payload.currency,
    payload.imageUrl,
    payload.notes,
    payload.category,
    payload.isActive,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

const updateProductById = async (id, payload) => {
  const sql = `
    UPDATE products
    SET
      name = $1,
      slug = $2,
      short_description = $3,
      description = $4,
      price_paise = $5,
      currency = $6,
      image_url = $7,
      notes = $8,
      category = $9,
      is_active = $10,
      updated_at = NOW()
    WHERE id = $11
    RETURNING
      id,
      name,
      slug,
      short_description AS "shortDescription",
      description,
      price_paise AS "pricePaise",
      currency,
      image_url AS "imageUrl",
      notes,
      category,
      is_active AS "isActive",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  const values = [
    payload.name,
    payload.slug,
    payload.shortDescription,
    payload.description,
    payload.pricePaise,
    payload.currency,
    payload.imageUrl,
    payload.notes,
    payload.category,
    payload.isActive,
    id,
  ];

  const result = await query(sql, values);
  return result.rows[0] || null;
};

const deleteProductById = async (id) => {
  const sql = `
    UPDATE products
    SET is_active = FALSE, updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      name,
      slug,
      short_description AS "shortDescription",
      description,
      price_paise AS "pricePaise",
      currency,
      image_url AS "imageUrl",
      notes,
      category,
      is_active AS "isActive",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

module.exports = {
  listProducts,
  listAdminProducts,
  countProducts,
  countAdminProducts,
  findProductBySlug,
  findProductById,
  getAdminProductDetail,
  createProduct,
  updateProductById,
  deleteProductById,
};
