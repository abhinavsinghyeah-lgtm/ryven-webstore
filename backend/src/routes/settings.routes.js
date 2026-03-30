const express = require("express");

const settingsController = require("../controllers/settings.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { updateStoreSettingsSchema, updateThemeEditorSchema } = require("../validators/settings.validator");

const router = express.Router();

router.get("/store-settings", settingsController.getPublicSettings);
router.get("/admin/theme-editor", requireAuth, requireAdmin, settingsController.getAdminThemeEditor);
router.put(
  "/admin/store-settings",
  requireAuth,
  requireAdmin,
  validate(updateStoreSettingsSchema),
  settingsController.updateAdminSettings,
);
router.put(
  "/admin/theme-editor",
  requireAuth,
  requireAdmin,
  validate(updateThemeEditorSchema),
  settingsController.updateAdminThemeEditor,
);

module.exports = router;
