const { query } = require("../config/db");

const upsertSession = async ({ sessionId, userId, ip, userAgent }) => {
  const sql = `
    INSERT INTO sessions (session_id, user_id, ip, user_agent, first_seen, last_seen)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    ON CONFLICT (session_id)
    DO UPDATE SET
      last_seen = NOW(),
      user_id = COALESCE(sessions.user_id, EXCLUDED.user_id),
      ip = COALESCE(EXCLUDED.ip, sessions.ip),
      user_agent = COALESCE(EXCLUDED.user_agent, sessions.user_agent)
    RETURNING id, session_id AS "sessionId", user_id AS "userId", ip, user_agent AS "userAgent", first_seen AS "firstSeen", last_seen AS "lastSeen"
  `;

  const result = await query(sql, [sessionId, userId || null, ip || null, userAgent || null]);
  return result.rows[0];
};

const logActivity = async ({ sessionId, userId, ip, path, method, status, durationMs }) => {
  const sql = `
    INSERT INTO activity_logs (session_id, user_id, ip, path, method, status, duration_ms)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  await query(sql, [sessionId, userId || null, ip || null, path, method, status, durationMs]);
};

const getEngagementSummary = async () => {
  const sql = `
    SELECT
      (SELECT COUNT(DISTINCT session_id)::int FROM sessions WHERE last_seen >= NOW() - INTERVAL '5 minutes') AS "liveVisitors",
      (SELECT COUNT(DISTINCT session_id)::int FROM sessions WHERE first_seen >= date_trunc('day', NOW())) AS "todayVisitors",
      (SELECT COUNT(DISTINCT session_id)::int FROM sessions WHERE first_seen >= NOW() - INTERVAL '7 days') AS "weekVisitors",
      (SELECT COUNT(DISTINCT session_id)::int FROM sessions WHERE first_seen >= NOW() - INTERVAL '30 days') AS "monthVisitors",
      (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (last_seen - first_seen)) / 60), 0)::numeric(10,2) FROM sessions WHERE first_seen >= NOW() - INTERVAL '30 days') AS "avgSessionMinutes"
  `;

  const result = await query(sql);
  return result.rows[0];
};

const listSessions = async ({ limit, offset }) => {
  const sql = `
    SELECT
      s.session_id AS "sessionId",
      s.user_id AS "userId",
      u.full_name AS "fullName",
      u.email,
      s.ip,
      s.first_seen AS "firstSeen",
      s.last_seen AS "lastSeen",
      (
        SELECT COUNT(*)::int
        FROM activity_logs l
        WHERE l.session_id = s.session_id
      ) AS "eventCount"
    FROM sessions s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.last_seen DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await query(sql, [limit, offset]);
  return result.rows;
};

const countSessions = async () => {
  const result = await query("SELECT COUNT(*)::int AS total FROM sessions");
  return result.rows[0].total;
};

const listActivityLogs = async ({ limit, offset }) => {
  const sql = `
    SELECT
      l.id,
      l.session_id AS "sessionId",
      l.user_id AS "userId",
      u.full_name AS "fullName",
      u.email,
      l.ip,
      l.path,
      l.method,
      l.status,
      l.duration_ms AS "durationMs",
      l.created_at AS "createdAt"
    FROM activity_logs l
    LEFT JOIN users u ON u.id = l.user_id
    ORDER BY l.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await query(sql, [limit, offset]);
  return result.rows;
};

const countActivityLogs = async () => {
  const result = await query("SELECT COUNT(*)::int AS total FROM activity_logs");
  return result.rows[0].total;
};

const listTopPages = async ({ days = 7, limit = 5 }) => {
  const sql = `
    SELECT path, COUNT(*)::int AS hits
    FROM activity_logs
    WHERE created_at >= NOW() - ($1::int || ' days')::interval
    GROUP BY path
    ORDER BY hits DESC
    LIMIT $2
  `;
  const result = await query(sql, [days, limit]);
  return result.rows;
};

const listErrorLogs = async ({ limit = 10 }) => {
  const sql = `
    SELECT
      l.id,
      l.path,
      l.method,
      l.status,
      l.ip,
      l.created_at AS "createdAt",
      u.email
    FROM activity_logs l
    LEFT JOIN users u ON u.id = l.user_id
    WHERE l.status >= 400
    ORDER BY l.created_at DESC
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

module.exports = {
  upsertSession,
  logActivity,
  getEngagementSummary,
  listSessions,
  countSessions,
  listActivityLogs,
  countActivityLogs,
  listTopPages,
  listErrorLogs,
};
