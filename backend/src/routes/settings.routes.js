const express = require("express");

const settingsController = require("../controllers/settings.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { updateStoreSettingsSchema } = require("../validators/settings.validator");

const router = express.Router();

router.get("/store-settings", settingsController.getPublicSettings);
router.put(
  "/admin/store-settings",
  requireAuth,
  requireAdmin,
  validate(updateStoreSettingsSchema),
  settingsController.updateAdminSettings,
);

module.exports = router;
