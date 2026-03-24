const { ApiError } = require("../utils/apiError");

const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    const details = parsed.error.flatten();
    return next(new ApiError(400, "Validation failed", details));
  }

  req.validated = parsed.data;
  return next();
};

module.exports = { validate };
