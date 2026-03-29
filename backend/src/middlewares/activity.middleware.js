const crypto = require("crypto");
const { upsertSession, logActivity } = require("../models/analytics.model");
const { verifyAccessToken } = require("../utils/jwt");

const SESSION_HEADER = "x-session-id";

const buildSessionId = ({ ip, userAgent }) => {
  const base = `${ip || "unknown"}|${userAgent || "unknown"}`;
  return crypto.createHash("sha256").update(base).digest("hex").slice(0, 32);
};

const extractUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    return payload?.id || null;
  } catch {
    return null;
  }
};

const activityLogger = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const start = Date.now();

  res.on("finish", async () => {
    try {
      if (req.originalUrl.includes("/webhook") || req.originalUrl.includes("/health")) {
        return;
      }

      const ip = req.ip;
      const userAgent = req.get("user-agent") || "";
      const sessionId = (req.headers[SESSION_HEADER] || "").toString().trim() || buildSessionId({ ip, userAgent });
      const userId = extractUserId(req);
      const durationMs = Date.now() - start;

      await upsertSession({ sessionId, userId, ip, userAgent });
      const pagePath = req.headers["x-page-path"];

      await logActivity({
        sessionId,
        userId,
        ip,
        path: pagePath ? pagePath.toString() : req.originalUrl,
        method: req.method,
        status: res.statusCode,
        durationMs,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }
  });

  return next();
};

module.exports = { activityLogger };
