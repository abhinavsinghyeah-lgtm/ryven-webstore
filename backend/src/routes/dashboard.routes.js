const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  customerOrdersSchema,
  adminOrdersSchema,
  updateOrderStatusSchema,
} = require("../validators/dashboard.validator");

const router = express.Router();

router.get("/account/dashboard", requireAuth, dashboardController.getCustomerDashboard);
router.get("/account/orders", requireAuth, validate(customerOrdersSchema), dashboardController.getCustomerOrders);

router.get("/admin/dashboard", requireAuth, requireAdmin, dashboardController.getAdminDashboard);
router.get("/admin/orders", requireAuth, requireAdmin, validate(adminOrdersSchema), dashboardController.getAdminOrders);
router.patch(
  "/admin/orders/:id/status",
  requireAuth,
  requireAdmin,
  validate(updateOrderStatusSchema),
  dashboardController.updateAdminOrderStatus,
);

module.exports = router;
