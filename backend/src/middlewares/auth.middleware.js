const { USER_ROLES } = require("../constants/roles");
const { ApiError } = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/jwt");

const requireAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
    return next(new ApiError(403, "Admin access required"));
  }

  return next();
};

module.exports = { requireAuth, requireAdmin };
