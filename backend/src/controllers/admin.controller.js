const { exec } = require("child_process");
const { query } = require("../config/db");
const { env } = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const {
  getEngagementSummary,
  listSessions,
  countSessions,
  listActivityLogs,
  countActivityLogs,
  listTopPages,
  listErrorLogs,
} = require("../models/analytics.model");
const { listUsersForAdmin, countUsersForAdmin, updateUserRole, updateUserStatus } = require("../models/user.model");

const getControlStatus = asyncHandler(async (_req, res) => {
  let dbConnected = false;
  try {
    await query("SELECT 1");
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  const memory = process.memoryUsage();
  res.status(200).json({
    status: "ok",
    data: {
      apiUptimeSeconds: Math.floor(process.uptime()),
      dbConnected,
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
      },
      env: env.NODE_ENV,
      controlActionsEnabled: Boolean(env.CONTROL_ACTIONS_SECRET),
    },
  });
});

const runControlAction = asyncHandler(async (req, res) => {
  if (!env.CONTROL_ACTIONS_SECRET) {
    throw new ApiError(503, "Control actions are disabled. Set CONTROL_ACTIONS_SECRET to enable.");
  }

  const provided = req.headers["x-control-secret"] || req.body?.secret;
  if (!provided || provided !== env.CONTROL_ACTIONS_SECRET) {
    throw new ApiError(403, "Invalid control secret.");
  }

  const action = req.body?.action;
  const commands = {
    "restart-frontend": "pm2 restart ryven-frontend",
    "restart-backend": "pm2 restart ryven-backend",
    "reload-nginx": "sudo systemctl reload nginx",
  };

  if (!commands[action]) {
    throw new ApiError(400, "Unknown control action.");
  }

  exec(commands[action], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: "Action failed", details: stderr || error.message });
    }
    return res.status(200).json({ status: "ok", output: stdout || "Action executed." });
  });
});

const getEngagementOverview = asyncHandler(async (_req, res) => {
  const summary = await getEngagementSummary();
  const topPages = await listTopPages({ days: 7, limit: 6 });
  res.status(200).json({ summary, topPages });
});

const getEngagementSessions = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);
  const [sessions, total] = await Promise.all([listSessions({ limit, offset }), countSessions()]);
  res.status(200).json({
    sessions,
    pagination: {
      limit,
      offset,
      total,
    },
  });
});

const getEngagementLogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);
  const [logs, total] = await Promise.all([listActivityLogs({ limit, offset }), countActivityLogs()]);
  res.status(200).json({
    logs,
    pagination: {
      limit,
      offset,
      total,
    },
  });
});

const getErrorLogs = asyncHandler(async (_req, res) => {
  const logs = await listErrorLogs({ limit: 12 });
  res.status(200).json({ logs });
});

const getUsers = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);
  const [users, total] = await Promise.all([listUsersForAdmin({ limit, offset }), countUsersForAdmin()]);
  res.status(200).json({
    users,
    pagination: {
      limit,
      offset,
      total,
    },
  });
});

const patchUserRole = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const role = req.body?.role;
  if (!userId || !role) {
    throw new ApiError(400, "User id and role are required.");
  }
  const updated = await updateUserRole({ userId, role });
  if (!updated) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ user: updated });
});

const patchUserStatus = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const isActive = req.body?.isActive;
  if (!userId || typeof isActive !== "boolean") {
    throw new ApiError(400, "User id and isActive are required.");
  }
  const updated = await updateUserStatus({ userId, isActive });
  if (!updated) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ user: updated });
});

module.exports = {
  getControlStatus,
  runControlAction,
  getEngagementOverview,
  getEngagementSessions,
  getEngagementLogs,
  getErrorLogs,
  getUsers,
  patchUserRole,
  patchUserStatus,
};
