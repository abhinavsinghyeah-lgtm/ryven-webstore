const { query } = require("../config/db");

const getOrCreateCart = async (userId) => {
  const sql = `
    INSERT INTO carts (user_id)
    VALUES ($1)
    ON CONFLICT (user_id)
    DO UPDATE SET updated_at = NOW()
    RETURNING id, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"
  `;

  const result = await query(sql, [userId]);
  return result.rows[0];
};

const upsertCartItem = async ({ cartId, productId, quantityDelta }) => {
  const sql = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING id, cart_id AS "cartId", product_id AS "productId", quantity, created_at AS "createdAt"
  `;

  const result = await query(sql, [cartId, productId, quantityDelta]);
  return result.rows[0];
};

const setCartItemQuantity = async ({ cartId, productId, quantity }) => {
  const sql = `
    UPDATE cart_items
    SET quantity = $1
    WHERE cart_id = $2 AND product_id = $3
    RETURNING id, cart_id AS "cartId", product_id AS "productId", quantity, created_at AS "createdAt"
  `;

  const result = await query(sql, [quantity, cartId, productId]);
  return result.rows[0] || null;
};

const removeCartItemByProductId = async ({ cartId, productId }) => {
  const sql = "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING id";
  const result = await query(sql, [cartId, productId]);
  return Boolean(result.rows[0]);
};

const getCartWithItems = async (userId) => {
  const sql = `
    SELECT
      c.id AS "cartId",
      c.user_id AS "userId",
      c.updated_at AS "updatedAt",
      ci.product_id AS "productId",
      ci.quantity,
      p.name,
      p.slug,
      p.image_url AS "imageUrl",
      p.price_paise AS "pricePaise",
      p.currency,
      p.is_active AS "isActive"
    FROM carts c
    LEFT JOIN cart_items ci ON ci.cart_id = c.id
    LEFT JOIN products p ON p.id = ci.product_id
    WHERE c.user_id = $1
    ORDER BY ci.created_at DESC NULLS LAST
  `;

  const result = await query(sql, [userId]);
  return result.rows;
};

const clearCartByUserId = async (userId) => {
  const cartResult = await query("SELECT id FROM carts WHERE user_id = $1 LIMIT 1", [userId]);
  if (!cartResult.rows[0]) {
    return;
  }

  await query("DELETE FROM cart_items WHERE cart_id = $1", [cartResult.rows[0].id]);
};

module.exports = {
  getOrCreateCart,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItemByProductId,
  getCartWithItems,
  clearCartByUserId,
};
