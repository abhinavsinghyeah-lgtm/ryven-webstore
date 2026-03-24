const bcrypt = require("bcryptjs");
const { USER_ROLES } = require("../constants/roles");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, findUserById, setUserPassword } = require("../models/user.model");
const { env } = require("../config/env");
const { ApiError } = require("../utils/apiError");
const { signAccessToken } = require("../utils/jwt");

const signup = async ({ fullName, email, password }) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({
    fullName,
    email,
    passwordHash,
    role: USER_ROLES.CUSTOMER,
  });

  const token = signAccessToken({ id: user.id, role: user.role, email: user.email });

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAccessToken({ id: user.id, role: user.role, email: user.email });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const setPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ApiError(400, "Activation link is invalid or expired");
  }

  if (payload.iss !== "ryven-activate") {
    throw new ApiError(400, "Invalid activation token");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const updated = await setUserPassword({ userId: payload.userId, passwordHash });

  if (!updated) {
    throw new ApiError(409, "Password has already been set for this account");
  }
};

module.exports = { signup, login, getCurrentUser, setPassword };
