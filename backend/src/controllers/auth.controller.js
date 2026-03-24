const { asyncHandler } = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.validated.body;
  const result = await authService.signup({ fullName, email, password });

  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await authService.login({ email, password });

  res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({ user });
});

const setPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.validated.body;
  await authService.setPassword({ token, password });
  res.status(200).json({ message: "Password set successfully. You can now log in." });
});

module.exports = { signup, login, me, setPassword };
