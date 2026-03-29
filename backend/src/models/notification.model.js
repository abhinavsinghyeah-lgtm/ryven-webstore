const { query } = require("../config/db");

const createUserNotification = async ({
  userId,
  sourceUserId = null,
  type,
  title,
  message,
  meta = {},
}) => {
  const sql = `
    INSERT INTO user_notifications (user_id, source_user_id, type, title, message, meta)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    RETURNING
      id,
      user_id AS "userId",
      source_user_id AS "sourceUserId",
      type,
      title,
      message,
      meta,
      is_read AS "isRead",
      read_at AS "readAt",
      created_at AS "createdAt"
  `;

  const result = await query(sql, [userId, sourceUserId, type, title, message, JSON.stringify(meta)]);
  return result.rows[0];
};

const listUserNotifications = async ({ userId, limit, offset }) => {
  const sql = `
    SELECT *
    FROM (
      SELECT
        n.id::text AS id,
        n.type,
        n.title,
        n.message,
        n.meta,
        n.is_read AS "isRead",
        n.created_at AS "createdAt"
      FROM user_notifications n
      WHERE n.user_id = $1

      UNION ALL

      SELECT
        ('order-' || o.id)::text AS id,
        CASE WHEN o.status = 'paid' THEN 'payment' ELSE 'order' END AS type,
        CASE
          WHEN o.status = 'paid' THEN 'Payment received'
          WHEN o.status = 'shipped' THEN 'Order shipped'
          WHEN o.status = 'delivered' THEN 'Order delivered'
          WHEN o.status = 'processing' THEN 'Order is being prepared'
          WHEN o.status = 'cancelled' THEN 'Order cancelled'
          ELSE 'Order placed'
        END AS title,
        CASE
          WHEN o.status = 'paid' THEN 'We received payment for your order successfully.'
          WHEN o.status = 'shipped' THEN 'Your order is on the way.'
          WHEN o.status = 'delivered' THEN 'Your order has been delivered.'
          WHEN o.status = 'processing' THEN 'Your order is currently being processed.'
          WHEN o.status = 'cancelled' THEN 'Your order was cancelled. Contact support if this looks wrong.'
          ELSE 'Your order was created and is awaiting the next update.'
        END AS message,
        jsonb_build_object('orderId', o.id, 'status', o.status) AS meta,
        FALSE AS "isRead",
        o.created_at AS "createdAt"
      FROM orders o
      WHERE o.user_id = $1

      UNION ALL

      SELECT
        ('cart-' || c.user_id)::text AS id,
        'abandoned_cart' AS type,
        'You left items in your cart' AS title,
        'Complete your checkout before your picks go out of stock.' AS message,
        jsonb_build_object('itemCount', COUNT(ci.id)::int) AS meta,
        FALSE AS "isRead",
        c.updated_at AS "createdAt"
      FROM carts c
      INNER JOIN cart_items ci ON ci.cart_id = c.id
      WHERE c.user_id = $1
        AND c.updated_at >= NOW() - INTERVAL '30 days'
        AND NOT EXISTS (
          SELECT 1
          FROM orders o
          WHERE o.user_id = c.user_id
            AND o.created_at >= c.updated_at
        )
      GROUP BY c.user_id, c.updated_at
    ) notification_feed
    ORDER BY "createdAt" DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [userId, limit, offset]);
  return result.rows;
};

const countUserNotifications = async (userId) => {
  const sql = `
    SELECT (
      (SELECT COUNT(*)::int FROM user_notifications WHERE user_id = $1)
      +
      (SELECT COUNT(*)::int FROM orders WHERE user_id = $1)
      +
      (SELECT COUNT(*)::int
       FROM carts c
       INNER JOIN cart_items ci ON ci.cart_id = c.id
       WHERE c.user_id = $1
         AND c.updated_at >= NOW() - INTERVAL '30 days'
         AND NOT EXISTS (
           SELECT 1
           FROM orders o
           WHERE o.user_id = c.user_id
             AND o.created_at >= c.updated_at
         )
       GROUP BY c.user_id, c.updated_at
       LIMIT 1)
    ) AS total
  `;

  const result = await query(sql, [userId]);
  return Number(result.rows[0]?.total || 0);
};

const markNotificationsRead = async ({ userId }) => {
  await query(
    `
      UPDATE user_notifications
      SET is_read = TRUE, read_at = NOW()
      WHERE user_id = $1 AND is_read = FALSE
    `,
    [userId],
  );
};

module.exports = {
  createUserNotification,
  listUserNotifications,
  countUserNotifications,
  markNotificationsRead,
};
