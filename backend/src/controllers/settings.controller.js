const { asyncHandler } = require("../utils/asyncHandler");
const settingsService = require("../services/settings.service");

const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getPublicStoreSettings();
  res.status(200).json({ settings });
});

const getAdminThemeEditor = asyncHandler(async (_req, res) => {
  const themeConfig = await settingsService.getAdminThemeEditorSettings();
  res.status(200).json({ themeConfig });
});

const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateAdminStoreSettings(req.validated.body);
  res.status(200).json({ settings });
});

const updateAdminThemeEditor = asyncHandler(async (req, res) => {
  const themeConfig = await settingsService.updateAdminThemeEditorSettings(req.validated.body);
  res.status(200).json({ themeConfig });
});

module.exports = { getPublicSettings, getAdminThemeEditor, updateAdminSettings, updateAdminThemeEditor };
