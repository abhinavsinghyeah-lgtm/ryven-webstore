const { asyncHandler } = require("../utils/asyncHandler");
const settingsService = require("../services/settings.service");

const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getPublicStoreSettings();
  res.status(200).json({ settings });
});

const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateAdminStoreSettings(req.validated.body);
  res.status(200).json({ settings });
});

module.exports = { getPublicSettings, updateAdminSettings };
