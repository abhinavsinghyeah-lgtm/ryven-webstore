const { query } = require("../config/db");

const createUser = async ({ fullName, email, phone = null, passwordHash = null, role }) => {
  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name AS "fullName", email, phone, role, is_active AS "isActive", created_at AS "createdAt"
  `;

  const values = [fullName, email.toLowerCase(), phone, passwordHash, role];
  const result = await query(sql, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, password_hash AS "passwordHash", role, is_active AS "isActive", is_verified AS "isVerified"
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await query(sql, [email.toLowerCase()]);
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, role, is_active AS "isActive", is_password_set AS "isPasswordSet", is_verified AS "isVerified", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const findUserByPhone = async (phone) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, role, is_active AS "isActive", is_verified AS "isVerified"
    FROM users
    WHERE phone = $1
    LIMIT 1
  `;

  const result = await query(sql, [phone]);
  return result.rows[0] || null;
};

const findOrCreateGuestUser = async ({ fullName, email, phone }) => {
  const normalizedEmail = email.toLowerCase();

  // Prefer phone as primary identity when available
  if (phone) {
    const existingByPhone = await findUserByPhone(phone);
    if (existingByPhone) {
      return { user: existingByPhone, isNew: false };
    }
  }

  const existingByEmail = await findUserByEmail(normalizedEmail);
  if (existingByEmail) {
    if (!existingByEmail.phone && phone) {
      await updateUserPhone({ userId: existingByEmail.id, phone });
    }
    return { user: existingByEmail, isNew: false };
  }

  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role, is_password_set, is_verified)
    VALUES ($1, $2, $3, NULL, 'customer', FALSE, FALSE)
    RETURNING id, full_name AS "fullName", email, phone, role, is_active AS "isActive", is_password_set AS "isPasswordSet", is_verified AS "isVerified", created_at AS "createdAt"
  `;

  const result = await query(sql, [fullName, normalizedEmail, phone]);
  return { user: result.rows[0], isNew: true };
};

const setUserPassword = async ({ userId, passwordHash }) => {
  const sql = `
    UPDATE users
    SET password_hash = $1, is_password_set = TRUE
    WHERE id = $2 AND is_password_set = FALSE
    RETURNING id
  `;

  const result = await query(sql, [passwordHash, userId]);
  return Boolean(result.rows[0]);
};

const updateUserPhone = async ({ userId, phone }) => {
  await query("UPDATE users SET phone = $1, updated_at = NOW() WHERE id = $2", [phone, userId]);
};

const markUserVerified = async ({ userId }) => {
  await query("UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1", [userId]);
};

const listUsersForAdmin = async ({ limit, offset }) => {
  const sql = `
    SELECT
      u.id,
      u.full_name AS "fullName",
      u.email,
      u.phone,
      u.role,
      u.is_active AS "isActive",
      u.created_at AS "createdAt",
      u.updated_at AS "updatedAt",
      s.last_seen AS "lastSeen",
      s.ip AS "lastIp"
    FROM users u
    LEFT JOIN LATERAL (
      SELECT last_seen, ip
      FROM sessions
      WHERE user_id = u.id
      ORDER BY last_seen DESC
      LIMIT 1
    ) s ON TRUE
    ORDER BY u.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await query(sql, [limit, offset]);
  return result.rows;
};

const countUsersForAdmin = async () => {
  const result = await query("SELECT COUNT(*)::int AS total FROM users");
  return result.rows[0].total;
};

const updateUserRole = async ({ userId, role }) => {
  const result = await query(
    "UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, role, updated_at AS \"updatedAt\"",
    [role, userId],
  );
  return result.rows[0] || null;
};

const updateUserStatus = async ({ userId, isActive }) => {
  const result = await query(
    "UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_active AS \"isActive\", updated_at AS \"updatedAt\"",
    [isActive, userId],
  );
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserById,
  findOrCreateGuestUser,
  setUserPassword,
  updateUserPhone,
  markUserVerified,
  listUsersForAdmin,
  countUsersForAdmin,
  updateUserRole,
  updateUserStatus,
};
