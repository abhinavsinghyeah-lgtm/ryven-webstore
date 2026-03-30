const { getStoreSettings, updateStoreSettings, updateThemeConfig } = require("../models/storeSettings.model");
const { ApiError } = require("../utils/apiError");
const { normalizeThemeConfig } = require("../utils/themeConfig");

const getPublicStoreSettings = async () => {
  const settings = await getStoreSettings();
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return {
    ...settings,
    themeConfig: normalizeThemeConfig(settings.themeConfig),
  };
};

const updateAdminStoreSettings = async (payload) => {
  const settings = await updateStoreSettings(payload);
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return {
    ...settings,
    themeConfig: normalizeThemeConfig(settings.themeConfig),
  };
};

const getAdminThemeEditorSettings = async () => {
  const settings = await getStoreSettings();
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return normalizeThemeConfig(settings.themeConfig);
};

const updateAdminThemeEditorSettings = async ({ themeConfig }) => {
  const settings = await updateThemeConfig({ themeConfig: normalizeThemeConfig(themeConfig) });
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return normalizeThemeConfig(settings.themeConfig);
};

module.exports = {
  getPublicStoreSettings,
  updateAdminStoreSettings,
  getAdminThemeEditorSettings,
  updateAdminThemeEditorSettings,
};
