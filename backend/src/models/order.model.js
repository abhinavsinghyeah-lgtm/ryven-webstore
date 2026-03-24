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
      subtotal_paise, shipping_paise, total_paise, currency,
      razorpay_order_id, razorpay_payment_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING
      id,
      status,
      subtotal_paise AS "subtotalPaise",
      shipping_paise AS "shippingPaise",
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
    subtotalPaise, shippingPaise, totalPaise, currency,
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
      product_id AS "productId",
      product_name AS "productName",
      product_image_url AS "productImageUrl",
      unit_price_paise AS "unitPricePaise",
      quantity,
      line_total_paise AS "lineTotalPaise"
    FROM order_items
    WHERE order_id = $1
    ORDER BY id
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

const updateOrderStatus = async ({ razorpayOrderId, status, razorpayPaymentId }) => {
  const sql = `
    UPDATE orders
    SET status = $1, razorpay_payment_id = COALESCE($2, razorpay_payment_id), updated_at = NOW()
    WHERE razorpay_order_id = $3
  `;

  await query(sql, [status, razorpayPaymentId || null, razorpayOrderId]);
};

module.exports = { createOrder, findOrderById, updateOrderStatus };
