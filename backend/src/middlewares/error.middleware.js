const { ApiError } = require("../utils/apiError");

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = { errorHandler };
