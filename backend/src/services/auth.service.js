const crypto = require("crypto");
const { USER_ROLES } = require("../constants/roles");
const { env } = require("../config/env");
const { ApiError } = require("../utils/apiError");
const { signAccessToken } = require("../utils/jwt");
const { createUser, findUserByEmail, findUserByPhone, findUserById, markUserVerified, updateUserPhone } = require("../models/user.model");
const { createOtp, findLatestOtp, recordOtpAttempt, consumeOtp } = require("../models/otp.model");
const { sendOtpEmail } = require("./email.service");
const { sendOtpSms } = require("./sms.service");

const OTP_EXP_MINUTES = 10;
const OTP_LENGTH = 6;
const OTP_COOLDOWN_SECONDS = 45;
const OTP_MAX_ATTEMPTS = 5;

const normalizeEmail = (email) => email.trim().toLowerCase();

const normalizePhone = (phone) => phone.replace(/\D/g, "");

const detectIdentifier = (identifier) => {
  const trimmed = identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (isEmail) return { channel: "email", value: normalizeEmail(trimmed) };
  const phone = normalizePhone(trimmed);
  if (phone.length < 7) {
    throw new ApiError(400, "Enter a valid email or phone number");
  }
  return { channel: "sms", value: phone };
};

const generateOtp = () => {
  const bytes = crypto.randomBytes(4).readUInt32BE(0);
  const code = (bytes % 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
  return code;
};

const hashOtp = ({ code, identifier }) =>
  crypto.createHmac("sha256", env.JWT_SECRET).update(`${identifier}|${code}`).digest("hex");

const requestOtp = async ({ identifier, fullName, email, phone }) => {
  const { channel, value } = detectIdentifier(identifier);
  const normalizedEmail = email ? normalizeEmail(email) : null;
  const normalizedPhone = phone ? normalizePhone(phone) : null;

  let user = null;
  if (channel === "email") {
    user = await findUserByEmail(value);
  } else {
    user = await findUserByPhone(value);
  }

  if (user && normalizedPhone && !user.phone) {
    await updateUserPhone({ userId: user.id, phone: normalizedPhone });
  }

  if (!user && fullName) {
    user = await createUser({
      fullName: fullName.trim(),
      email: channel === "email" ? value : normalizedEmail || `${value.replace(/\D/g, "")}@ryven.local`,
      phone: channel === "sms" ? value : normalizedPhone,
      role: USER_ROLES.CUSTOMER,
    });
  }

  if (!user) {
    // Avoid user enumeration, but still respond success
    return { status: "ok" };
  }

  const latest = await findLatestOtp({ identifier: value, channel });
  if (latest) {
    const elapsed = (Date.now() - new Date(latest.createdAt).getTime()) / 1000;
    if (elapsed < OTP_COOLDOWN_SECONDS) {
      throw new ApiError(429, "Please wait before requesting another OTP");
    }
  }

  const code = generateOtp();
  const codeHash = hashOtp({ code, identifier: value });
  const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

  await createOtp({
    userId: user.id,
    identifier: value,
    channel,
    codeHash,
    expiresAt,
  });

  if (channel === "email") {
    try {
      await sendOtpEmail({ to: value, code });
    } catch (err) {
      console.error("OTP email failed:", err);
      throw new ApiError(503, "Email OTP is temporarily unavailable. Please try again later.");
    }
  } else {
    try {
      await sendOtpSms({ to: value, code });
    } catch (err) {
      console.error("OTP SMS failed:", err);
      throw new ApiError(503, "SMS OTP is temporarily unavailable. Please use email.");
    }
  }

  return { status: "ok" };
};

const verifyOtp = async ({ identifier, code }) => {
  const { channel, value } = detectIdentifier(identifier);
  const latest = await findLatestOtp({ identifier: value, channel });

  if (!latest || latest.consumedAt) {
    throw new ApiError(400, "OTP is invalid or expired");
  }

  if (latest.attempts >= OTP_MAX_ATTEMPTS) {
    throw new ApiError(429, "Too many attempts. Please request a new OTP.");
  }

  if (new Date(latest.expiresAt).getTime() < Date.now()) {
    throw new ApiError(400, "OTP is invalid or expired");
  }

  const expectedHash = hashOtp({ code, identifier: value });
  if (expectedHash !== latest.codeHash) {
    await recordOtpAttempt({ id: latest.id });
    throw new ApiError(400, "OTP is invalid or expired");
  }

  await consumeOtp({ id: latest.id });
  await markUserVerified({ userId: latest.userId });

  const user = await findUserById(latest.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
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

module.exports = { requestOtp, verifyOtp, getCurrentUser };
