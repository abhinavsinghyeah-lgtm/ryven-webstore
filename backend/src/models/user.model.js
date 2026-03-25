const { query } = require("../config/db");

const createUser = async ({ fullName, email, phone = null, passwordHash = null, role }) => {
  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name AS "fullName", email, phone, role, created_at AS "createdAt"
  `;

  const values = [fullName, email.toLowerCase(), phone, passwordHash, role];
  const result = await query(sql, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, password_hash AS "passwordHash", role, is_verified AS "isVerified"
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await query(sql, [email.toLowerCase()]);
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, role, is_password_set AS "isPasswordSet", is_verified AS "isVerified", created_at AS "createdAt"
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const findUserByPhone = async (phone) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, role, is_verified AS "isVerified"
    FROM users
    WHERE phone = $1
    LIMIT 1
  `;

  const result = await query(sql, [phone]);
  return result.rows[0] || null;
};

const findOrCreateGuestUser = async ({ fullName, email, phone }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    if (!existing.phone && phone) {
      await updateUserPhone({ userId: existing.id, phone });
    }
    return { user: existing, isNew: false };
  }

  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role, is_password_set, is_verified)
    VALUES ($1, $2, $3, NULL, 'customer', FALSE, FALSE)
    RETURNING id, full_name AS "fullName", email, phone, role, is_password_set AS "isPasswordSet", is_verified AS "isVerified", created_at AS "createdAt"
  `;

  const result = await query(sql, [fullName, email.toLowerCase(), phone]);
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
  await query("UPDATE users SET phone = $1 WHERE id = $2", [phone, userId]);
};

const markUserVerified = async ({ userId }) => {
  await query("UPDATE users SET is_verified = TRUE WHERE id = $1", [userId]);
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
};
