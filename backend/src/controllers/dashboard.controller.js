const dashboardService = require("../services/dashboard.service");
const { asyncHandler } = require("../utils/asyncHandler");

const getCustomerDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCustomerDashboard(req.user.id);
  res.status(200).json(data);
});

const getCustomerOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.validated.query;
  const result = await dashboardService.getCustomerOrders({
    userId: req.user.id,
    page,
    limit,
  });
  res.status(200).json(result);
});

const getCustomerNotifications = asyncHandler(async (req, res) => {
  const { limit, offset } = req.validated.query;
  const result = await dashboardService.getCustomerNotifications({
    userId: req.user.id,
    limit,
    offset,
  });
  res.status(200).json(result);
});

const markCustomerNotificationsRead = asyncHandler(async (req, res) => {
  await dashboardService.markCustomerNotificationsRead({ userId: req.user.id });
  res.status(200).json({ status: "ok" });
});

const getAdminDashboard = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getAdminDashboard();
  res.status(200).json(data);
});

const getAdminOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.validated.query;
  const result = await dashboardService.getAdminOrders({ page, limit, status });
  res.status(200).json(result);
});

const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const order = await dashboardService.adminUpdateOrderStatus({
    orderId: req.validated.params.id,
    status: req.validated.body.status,
  });

  res.status(200).json({ order });
});

module.exports = {
  getCustomerDashboard,
  getCustomerOrders,
  getCustomerNotifications,
  markCustomerNotificationsRead,
  getAdminDashboard,
  getAdminOrders,
  updateAdminOrderStatus,
};
