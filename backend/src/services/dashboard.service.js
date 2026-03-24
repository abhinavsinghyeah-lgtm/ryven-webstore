const { findUserById } = require("../models/user.model");
const {
  listOrdersByUser,
  countOrdersByUser,
  listOrdersForAdmin,
  countOrdersForAdmin,
  updateOrderStatusById,
  getAdminOrderStats,
} = require("../models/order.model");
const { countProducts } = require("../models/product.model");
const { ApiError } = require("../utils/apiError");

const getCustomerDashboard = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [recentOrders, totalOrders] = await Promise.all([
    listOrdersByUser({ userId, limit: 5, offset: 0 }),
    countOrdersByUser(userId),
  ]);

  return {
    user,
    summary: {
      totalOrders,
      totalSpentPaise: recentOrders.reduce((sum, order) => sum + order.totalPaise, 0),
    },
    recentOrders,
  };
};

const getCustomerOrders = async ({ userId, page, limit }) => {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit > 50 ? 50 : limit;
  const offset = (safePage - 1) * safeLimit;

  const [orders, total] = await Promise.all([
    listOrdersByUser({ userId, limit: safeLimit, offset }),
    countOrdersByUser(userId),
  ]);

  return {
    orders,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getAdminDashboard = async () => {
  const [orderStats, totalProducts] = await Promise.all([
    getAdminOrderStats(),
    countProducts({ search: "" }),
  ]);

  return {
    stats: {
      totalOrders: orderStats.totalOrders,
      paidOrders: orderStats.paidOrders,
      pendingOrders: orderStats.pendingOrders,
      totalRevenuePaise: orderStats.totalRevenuePaise,
      paidRevenuePaise: orderStats.paidRevenuePaise,
      totalProducts,
    },
  };
};

const getAdminOrders = async ({ page, limit, status }) => {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit > 50 ? 50 : limit;
  const offset = (safePage - 1) * safeLimit;

  const [orders, total] = await Promise.all([
    listOrdersForAdmin({ status, limit: safeLimit, offset }),
    countOrdersForAdmin({ status }),
  ]);

  return {
    orders,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const adminUpdateOrderStatus = async ({ orderId, status }) => {
  const order = await updateOrderStatusById({ orderId, status });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};

module.exports = {
  getCustomerDashboard,
  getCustomerOrders,
  getAdminDashboard,
  getAdminOrders,
  adminUpdateOrderStatus,
};
