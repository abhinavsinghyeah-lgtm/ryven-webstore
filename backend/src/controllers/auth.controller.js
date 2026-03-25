const { asyncHandler } = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const requestOtp = asyncHandler(async (req, res) => {
  const { identifier, fullName, email, phone } = req.validated.body;
  const result = await authService.requestOtp({ identifier, fullName, email, phone });
  res.status(200).json(result);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { identifier, code } = req.validated.body;
  const result = await authService.verifyOtp({ identifier, code });
  res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({ user });
});

module.exports = { requestOtp, verifyOtp, me };
