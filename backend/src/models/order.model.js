const { query } = require("../config/db");

const createOrder = async ({
  userId,
  shippingName,
  shippingPhone,
  shippingAddress,
  shippingCity,
  shippingState,
  shippingPincode,
  shippingCountry,
  subtotalPaise,
  shippingPaise,
  shippingService,
  totalPaise,
  currency,
  razorpayOrderId,
  razorpayPaymentId,
  items,
}) => {
  const sql = `
    INSERT INTO orders (
      user_id, status,
      shipping_name, shipping_phone, shipping_address, shipping_city,
      shipping_state, shipping_pincode, shipping_country,
      subtotal_paise, shipping_paise, shipping_service, total_paise, currency,
      razorpay_order_id, razorpay_payment_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING
      id,
      status,
      subtotal_paise AS "subtotalPaise",
      shipping_paise AS "shippingPaise",
      shipping_service AS "shippingService",
      total_paise AS "totalPaise",
      currency,
      razorpay_order_id AS "razorpayOrderId",
      razorpay_payment_id AS "razorpayPaymentId",
      created_at AS "createdAt"
  `;

  const values = [
    userId, "paid",
    shippingName, shippingPhone, shippingAddress, shippingCity,
    shippingState, shippingPincode, shippingCountry,
    subtotalPaise, shippingPaise, shippingService, totalPaise, currency,
    razorpayOrderId, razorpayPaymentId,
  ];

  const orderResult = await query(sql, values);
  const order = orderResult.rows[0];

  const itemSql = `
    INSERT INTO order_items (order_id, product_id, product_name, product_image_url, unit_price_paise, quantity, line_total_paise)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  for (const item of items) {
    await query(itemSql, [
      order.id,
      item.productId,
      item.productName,
      item.productImageUrl,
      item.unitPricePaise,
      item.quantity,
      item.lineTotalPaise,
    ]);
  }

  return order;
};

const findOrderById = async (id) => {
  const orderSql = `
    SELECT
      o.id,
      o.status,
      o.shipping_name AS "shippingName",
      o.shipping_phone AS "shippingPhone",
      o.shipping_address AS "shippingAddress",
      o.shipping_city AS "shippingCity",
      o.shipping_state AS "shippingState",
      o.shipping_pincode AS "shippingPincode",
      o.shipping_country AS "shippingCountry",
      o.subtotal_paise AS "subtotalPaise",
      o.shipping_paise AS "shippingPaise",
      o.shipping_service AS "shippingService",
      o.total_paise AS "totalPaise",
      o.currency,
      o.razorpay_order_id AS "razorpayOrderId",
      o.razorpay_payment_id AS "razorpayPaymentId",
      o.user_id AS "userId",
      o.created_at AS "createdAt"
    FROM orders o
    WHERE o.id = $1
    LIMIT 1
  `;

  const itemsSql = `
    SELECT
      oi.id AS "id",
      oi.product_id AS "productId",
      oi.product_name AS "productName",
      oi.product_image_url AS "productImageUrl",
      oi.unit_price_paise AS "unitPricePaise",
      oi.quantity,
      oi.line_total_paise AS "lineTotalPaise",
      o.currency AS "currency"
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE oi.order_id = $1
    ORDER BY oi.id
  `;

  const [orderResult, itemsResult] = await Promise.all([
    query(orderSql, [id]),
    query(itemsSql, [id]),
  ]);

  if (!orderResult.rows[0]) {
    return null;
  }

  return { ...orderResult.rows[0], items: itemsResult.rows };
};

const findOrderByRazorpayOrderId = async (razorpayOrderId) => {
  const orderSql = `
    SELECT
      o.id,
      o.status,
      o.shipping_name AS "shippingName",
      o.shipping_phone AS "shippingPhone",
      o.shipping_address AS "shippingAddress",
      o.shipping_city AS "shippingCity",
      o.shipping_state AS "shippingState",
      o.shipping_pincode AS "shippingPincode",
      o.shipping_country AS "shippingCountry",
      o.subtotal_paise AS "subtotalPaise",
      o.shipping_paise AS "shippingPaise",
      o.shipping_service AS "shippingService",
      o.total_paise AS "totalPaise",
      o.currency,
      o.razorpay_order_id AS "razorpayOrderId",
      o.razorpay_payment_id AS "razorpayPaymentId",
      o.user_id AS "userId",
      o.created_at AS "createdAt"
    FROM orders o
    WHERE o.razorpay_order_id = $1
    LIMIT 1
  `;

  const itemsSql = `
    SELECT
      oi.id AS "id",
      oi.product_id AS "productId",
      oi.product_name AS "productName",
      oi.product_image_url AS "productImageUrl",
      oi.unit_price_paise AS "unitPricePaise",
      oi.quantity,
      oi.line_total_paise AS "lineTotalPaise",
      o.currency AS "currency"
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE oi.order_id = (SELECT id FROM orders WHERE razorpay_order_id = $1 LIMIT 1)
    ORDER BY oi.id
  `;

  const [orderResult, itemsResult] = await Promise.all([
    query(orderSql, [razorpayOrderId]),
    query(itemsSql, [razorpayOrderId]),
  ]);

  if (!orderResult.rows[0]) {
    return null;
  }

  return { ...orderResult.rows[0], items: itemsResult.rows };
};

const updateOrderStatus = async ({ razorpayOrderId, status, razorpayPaymentId }) => {
  const sql = `
    UPDATE orders
    SET status = $1, razorpay_payment_id = COALESCE($2, razorpay_payment_id), updated_at = NOW()
    WHERE razorpay_order_id = $3
  `;

  await query(sql, [status, razorpayPaymentId || null, razorpayOrderId]);
};

const listOrdersByUser = async ({ userId, limit, offset }) => {
  const sql = `
    SELECT
      o.id,
      o.status,
      o.total_paise AS "totalPaise",
      o.currency,
      o.created_at AS "createdAt",
      COUNT(oi.id)::int AS "itemCount"
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [userId, limit, offset]);
  return result.rows;
};

const countOrdersByUser = async (userId) => {
  const result = await query("SELECT COUNT(*)::int AS total FROM orders WHERE user_id = $1", [userId]);
  return result.rows[0].total;
};

const listOrdersForAdmin = async ({ status, limit, offset }) => {
  const sql = `
    SELECT
      o.id,
      o.status,
      o.total_paise AS "totalPaise",
      o.currency,
      o.created_at AS "createdAt",
      o.shipping_name AS "shippingName",
      o.shipping_city AS "shippingCity",
      o.shipping_state AS "shippingState",
      u.email AS "customerEmail",
      COUNT(oi.id)::int AS "itemCount"
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ($1::text = '' OR o.status = $1)
    GROUP BY o.id, u.email
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [status || "", limit, offset]);
  return result.rows;
};

const countOrdersForAdmin = async ({ status }) => {
  const sql = "SELECT COUNT(*)::int AS total FROM orders WHERE ($1::text = '' OR status = $1)";
  const result = await query(sql, [status || ""]);
  return result.rows[0].total;
};

const updateOrderStatusById = async ({ orderId, status }) => {
  const sql = `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      status,
      total_paise AS "totalPaise",
      currency,
      created_at AS "createdAt"
  `;

  const result = await query(sql, [status, orderId]);
  return result.rows[0] || null;
};

const getAdminOrderStats = async () => {
  const sql = `
    SELECT
      COUNT(*)::int AS "totalOrders",
      COALESCE(SUM(total_paise), 0)::int AS "totalRevenuePaise",
      COALESCE(SUM(CASE WHEN status = 'paid' THEN total_paise ELSE 0 END), 0)::int AS "paidRevenuePaise",
      COUNT(*) FILTER (WHERE status = 'paid')::int AS "paidOrders",
      COUNT(*) FILTER (WHERE status = 'pending')::int AS "pendingOrders"
    FROM orders
  `;

  const result = await query(sql);
  return result.rows[0];
};

module.exports = {
  createOrder,
  findOrderById,
  findOrderByRazorpayOrderId,
  updateOrderStatus,
  listOrdersByUser,
  countOrdersByUser,
  listOrdersForAdmin,
  countOrdersForAdmin,
  updateOrderStatusById,
  getAdminOrderStats,
};
