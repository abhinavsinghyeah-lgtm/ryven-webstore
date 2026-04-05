const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const { upsertSession, logActivity } = require("../models/analytics.model");
const { verifyAccessToken } = require("../utils/jwt");

const router = express.Router();

// Separate rate limit for tracking — generous since every page view sends one
const trackLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,                  // 60 per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many tracking requests" },
});

const buildSessionId = ({ ip, userAgent }) => {
  const base = `${ip || "unknown"}|${userAgent || "unknown"}`;
  return crypto.createHash("sha256").update(base).digest("hex").slice(0, 32);
};

router.post("/track", trackLimiter, async (req, res) => {
  try {
    const { path: pagePath, referrer } = req.body || {};

    if (!pagePath || typeof pagePath !== "string" || pagePath.length > 500) {
      return res.status(204).end();
    }

    const ip = req.ip;
    const userAgent = req.get("user-agent") || "";
    const sessionId = buildSessionId({ ip, userAgent });

    // Extract userId from cookie or bearer token (non-blocking)
    let userId = null;
    try {
      const auth = req.headers.authorization;
      if (auth && auth.startsWith("Bearer ")) {
        const token = auth.replace("Bearer ", "").trim();
        if (token) {
          const payload = verifyAccessToken(token);
          userId = payload?.id || null;
        }
      } else if (req.cookies?.token) {
        const payload = verifyAccessToken(req.cookies.token);
        userId = payload?.id || null;
      }
    } catch {}

    // Fire and forget — don't block the response
    upsertSession({ sessionId, userId, ip, userAgent }).catch(() => {});
    logActivity({
      sessionId,
      userId,
      ip,
      path: pagePath,
      method: "PAGEVIEW",
      status: 200,
      durationMs: 0,
    }).catch(() => {});

    return res.status(204).end();
  } catch {
    return res.status(204).end();
  }
});

module.exports = router;
