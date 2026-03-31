const { getStoreSettings, updateStoreSettings } = require("../models/storeSettings.model");
const { ApiError } = require("../utils/apiError");

const getPublicStoreSettings = async () => {
  const settings = await getStoreSettings();
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return settings;
};

const updateAdminStoreSettings = async (payload) => {
  const settings = await updateStoreSettings(payload);
  if (!settings) {
    throw new ApiError(404, "Store settings not initialized");
  }
  return settings;
};

module.exports = { getPublicStoreSettings, updateAdminStoreSettings };
