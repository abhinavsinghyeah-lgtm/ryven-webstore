const express = require("express");

const adminController = require("../controllers/admin.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  paginationSchema,
  controlActionSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  createUserSchema,
  sendUserNotificationSchema,
} = require("../validators/admin.validator");

const router = express.Router();

router.get("/admin/control/status", requireAuth, requireAdmin, adminController.getControlStatus);
router.post(
  "/admin/control/action",
  requireAuth,
  requireAdmin,
  validate(controlActionSchema),
  adminController.runControlAction,
);
router.get("/admin/control/errors", requireAuth, requireAdmin, adminController.getErrorLogs);
router.get("/admin/control/activity", requireAuth, requireAdmin, validate(paginationSchema), adminController.getControlActivityLogs);

router.get("/admin/engagement/overview", requireAuth, requireAdmin, adminController.getEngagementOverview);
router.get("/admin/engagement/sessions", requireAuth, requireAdmin, validate(paginationSchema), adminController.getEngagementSessions);
router.get("/admin/engagement/logs", requireAuth, requireAdmin, validate(paginationSchema), adminController.getEngagementLogs);
router.get("/admin/engagement/abandoned", requireAuth, requireAdmin, validate(paginationSchema), adminController.getEngagementAbandoned);
router.get("/admin/engagement/logs/export", requireAuth, requireAdmin, adminController.exportLogsCsv);

router.get("/admin/users", requireAuth, requireAdmin, validate(paginationSchema), adminController.getUsers);
router.post("/admin/users", requireAuth, requireAdmin, validate(createUserSchema), adminController.createAdminUser);
router.get("/admin/users/export", requireAuth, requireAdmin, adminController.exportUsersCsv);
router.post("/admin/users/:id/notify", requireAuth, requireAdmin, validate(sendUserNotificationSchema), adminController.sendUserNotification);
router.patch("/admin/users/:id/role", requireAuth, requireAdmin, validate(updateUserRoleSchema), adminController.patchUserRole);
router.patch("/admin/users/:id/status", requireAuth, requireAdmin, validate(updateUserStatusSchema), adminController.patchUserStatus);

router.get("/admin/notifications", requireAuth, requireAdmin, adminController.getNotifications);

module.exports = router;
