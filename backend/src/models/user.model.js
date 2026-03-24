const { query } = require("../config/db");

const createUser = async ({ fullName, email, passwordHash, role }) => {
  const sql = `
    INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name AS "fullName", email, role, created_at AS "createdAt"
  `;

  const values = [fullName, email.toLowerCase(), passwordHash, role];
  const result = await query(sql, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, password_hash AS "passwordHash", role
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const result = await query(sql, [email.toLowerCase()]);
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const sql = `
    SELECT id, full_name AS "fullName", email, phone, role, is_password_set AS "isPasswordSet", created_at AS "createdAt"
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

const findOrCreateGuestUser = async ({ fullName, email, phone }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    return { user: existing, isNew: false };
  }

  const sql = `
    INSERT INTO users (full_name, email, phone, password_hash, role, is_password_set)
    VALUES ($1, $2, $3, 'NOT_SET', 'customer', FALSE)
    RETURNING id, full_name AS "fullName", email, phone, role, is_password_set AS "isPasswordSet", created_at AS "createdAt"
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

module.exports = { createUser, findUserByEmail, findUserById, findOrCreateGuestUser, setUserPassword, updateUserPhone };
