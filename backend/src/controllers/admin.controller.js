const { exec } = require("child_process");
const os = require("os");
const util = require("util");
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
  countErrorLogs,
  listAbandonedCarts,
  countAbandonedCarts,
  listNotifications,
  countNotifications,
} = require("../models/analytics.model");
const {
  listUsersForAdmin,
  countUsersForAdmin,
  updateUserRole,
  updateUserStatus,
  createUser,
  findUserById,
} = require("../models/user.model");
const { listOrdersByUser, countOrdersByUser } = require("../models/order.model");
const { createUserNotification } = require("../models/notification.model");
const execAsync = util.promisify(exec);

const safeExec = async (command) => {
  try {
    const { stdout } = await execAsync(command, { timeout: 5000, windowsHide: true });
    return stdout.trim();
  } catch {
    return "";
  }
};

const getDiskUsage = async () => {
  const output = await safeExec("df -k /");
  const lines = output.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return null;
  }

  const parts = lines[lines.length - 1].split(/\s+/);
  if (parts.length < 6) {
    return null;
  }

  const totalBytes = Number(parts[1]) * 1024;
  const usedBytes = Number(parts[2]) * 1024;
  const freeBytes = Number(parts[3]) * 1024;
  const usedPercent = Number(String(parts[4]).replace("%", "")) || 0;

  return {
    path: parts[5],
    totalBytes,
    usedBytes,
    freeBytes,
    usedPercent,
  };
};

const getPm2Processes = async () => {
  const output = await safeExec("pm2 jlist");
  if (!output) {
    return [];
  }

  try {
    const apps = JSON.parse(output);
    return apps.map((app) => ({
      name: app.name,
      status: app.pm2_env?.status || "unknown",
      cpuPercent: Number(app.monit?.cpu || 0),
      memoryBytes: Number(app.monit?.memory || 0),
      uptimeSeconds: app.pm2_env?.pm_uptime ? Math.max(0, Math.floor((Date.now() - app.pm2_env.pm_uptime) / 1000)) : 0,
      restarts: Number(app.pm2_env?.restart_time || 0),
    }));
  } catch {
    return [];
  }
};

const getServiceStatus = async (name, command) => {
  const output = await safeExec(command);
  return {
    name,
    status: output || "unknown",
  };
};

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

const getSystemOverview = asyncHandler(async (_req, res) => {
  let dbConnected = false;
  try {
    await query("SELECT 1");
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  const totalMemoryBytes = os.totalmem();
  const freeMemoryBytes = os.freemem();
  const usedMemoryBytes = totalMemoryBytes - freeMemoryBytes;
  const cpuCount = os.cpus().length || 1;
  const loadAverage = os.loadavg();
  const cpuUsagePercent = Math.min(100, Number(((loadAverage[0] / cpuCount) * 100).toFixed(1)));
  const cpuUsedCoresApprox = Number(loadAverage[0].toFixed(2));
  const cpuFreeCoresApprox = Number(Math.max(0, cpuCount - loadAverage[0]).toFixed(2));

  const [disk, pm2Processes, nginxStatus] = await Promise.all([
    getDiskUsage(),
    getPm2Processes(),
    getServiceStatus("nginx", "systemctl is-active nginx"),
  ]);

  const services = [
    ...pm2Processes.map((process) => ({
      name: process.name,
      kind: "pm2",
      status: process.status,
      cpuPercent: process.cpuPercent,
      memoryBytes: process.memoryBytes,
      uptimeSeconds: process.uptimeSeconds,
      restarts: process.restarts,
    })),
    {
      name: "database",
      kind: "database",
      status: dbConnected ? "active" : "down",
      cpuPercent: null,
      memoryBytes: null,
      uptimeSeconds: null,
      restarts: null,
    },
    {
      name: nginxStatus.name,
      kind: "system",
      status: nginxStatus.status,
      cpuPercent: null,
      memoryBytes: null,
      uptimeSeconds: null,
      restarts: null,
    },
  ];

  res.status(200).json({
    summary: {
      hostname: os.hostname(),
      platform: `${os.platform()} ${os.release()}`,
      env: env.NODE_ENV,
      apiUptimeSeconds: Math.floor(process.uptime()),
      dbConnected,
      memory: {
        totalBytes: totalMemoryBytes,
        usedBytes: usedMemoryBytes,
        freeBytes: freeMemoryBytes,
        usedPercent: Number(((usedMemoryBytes / totalMemoryBytes) * 100).toFixed(1)),
      },
      cpu: {
        coreCount: cpuCount,
        model: os.cpus()[0]?.model || "Unknown CPU",
        loadAverage1m: Number(loadAverage[0].toFixed(2)),
        loadAverage5m: Number(loadAverage[1].toFixed(2)),
        loadAverage15m: Number(loadAverage[2].toFixed(2)),
        usedPercent: cpuUsagePercent,
        usedCoresApprox: cpuUsedCoresApprox,
        freeCoresApprox: cpuFreeCoresApprox,
      },
      storage: disk || {
        path: "/",
        totalBytes: 0,
        usedBytes: 0,
        freeBytes: 0,
        usedPercent: 0,
      },
    },
    services,
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

const getEngagementAbandoned = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);
  const [carts, total] = await Promise.all([listAbandonedCarts({ limit, offset }), countAbandonedCarts()]);
  res.status(200).json({
    carts,
    pagination: {
      limit,
      offset,
      total: total.total,
    },
  });
});

const getErrorLogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 5);
  const offset = Number(req.query.offset || 0);
  const [logs, total] = await Promise.all([listErrorLogs({ limit, offset }), countErrorLogs()]);
  res.status(200).json({
    logs,
    pagination: {
      limit,
      offset,
      total,
    },
  });
});

const getControlActivityLogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 5);
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

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.validated.params.id;
  const [user, recentOrders, totalOrders] = await Promise.all([
    findUserById(userId),
    listOrdersByUser({ userId, limit: 20, offset: 0 }),
    countOrdersByUser(userId),
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    user,
    recentOrders,
    summary: {
      totalOrders,
      activeOrders: recentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length,
      totalSpentPaise: recentOrders.reduce((sum, order) => sum + Number(order.totalPaise || 0), 0),
    },
  });
});

const createAdminUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, role } = req.validated.body;
  const user = await createUser({
    fullName,
    email,
    phone: phone || null,
    passwordHash: null,
    role: role || "customer",
  });
  res.status(201).json({ user });
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

const getNotifications = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 12);
  const offset = Number(req.query.offset || 0);
  const [events, total] = await Promise.all([listNotifications({ limit, offset }), countNotifications()]);
  res.status(200).json({
    events,
    pagination: {
      limit,
      offset,
      total,
    },
  });
});

const sendUserNotification = asyncHandler(async (req, res) => {
  const targetUserId = Number(req.params.id);
  const { title, message } = req.validated.body;

  const event = await createUserNotification({
    userId: targetUserId,
    sourceUserId: req.user.id,
    type: "admin_message",
    title,
    message,
    meta: { source: "admin" },
  });

  res.status(201).json({ event });
});

const exportUsersCsv = asyncHandler(async (_req, res) => {
  const users = await listUsersForAdmin({ limit: 2000, offset: 0 });
  const header = ["id", "fullName", "email", "phone", "role", "isActive", "createdAt", "lastSeen", "lastIp"];
  const rows = users.map((u) =>
    [u.id, u.fullName, u.email, u.phone || "", u.role, u.isActive, u.createdAt, u.lastSeen || "", u.lastIp || ""]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.status(200).send(csv);
});

const exportLogsCsv = asyncHandler(async (_req, res) => {
  const logs = await listActivityLogs({ limit: 2000, offset: 0 });
  const header = ["id", "sessionId", "userId", "email", "ip", "path", "method", "status", "durationMs", "createdAt"];
  const rows = logs.map((l) =>
    [
      l.id,
      l.sessionId || "",
      l.userId || "",
      l.email || "",
      l.ip || "",
      l.path,
      l.method,
      l.status,
      l.durationMs,
      l.createdAt,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=activity-logs.csv");
  res.status(200).send(csv);
});

module.exports = {
  getControlStatus,
  getSystemOverview,
  runControlAction,
  getEngagementOverview,
  getEngagementSessions,
  getEngagementLogs,
  getEngagementAbandoned,
  getErrorLogs,
  getControlActivityLogs,
  getUsers,
  getUserDetails,
  createAdminUser,
  patchUserRole,
  patchUserStatus,
  getNotifications,
  sendUserNotification,
  exportUsersCsv,
  exportLogsCsv,
};
