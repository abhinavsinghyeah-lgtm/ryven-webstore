const { ApiError } = require("../utils/apiError");

const errorHandler = (error, req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  // Log unexpected errors so we can see the real cause in PM2 logs.
  console.error("Unhandled error:", {
    path: req.originalUrl,
    method: req.method,
    message: error?.message,
    stack: error?.stack,
  });

  return res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = { errorHandler };
