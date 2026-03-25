const { query } = require("../config/db");

const createOtp = async ({ userId, identifier, channel, codeHash, expiresAt }) => {
  const sql = `
    INSERT INTO otp_codes (user_id, identifier, channel, code_hash, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, created_at AS "createdAt"
  `;

  const values = [userId, identifier, channel, codeHash, expiresAt];
  const result = await query(sql, values);
  return result.rows[0];
};

const findLatestOtp = async ({ identifier, channel }) => {
  const sql = `
    SELECT
      id,
      user_id AS "userId",
      identifier,
      channel,
      code_hash AS "codeHash",
      attempts,
      consumed_at AS "consumedAt",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    FROM otp_codes
    WHERE identifier = $1 AND channel = $2
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = await query(sql, [identifier, channel]);
  return result.rows[0] || null;
};

const recordOtpAttempt = async ({ id }) => {
  const sql = `
    UPDATE otp_codes
    SET attempts = attempts + 1
    WHERE id = $1
  `;
  await query(sql, [id]);
};

const consumeOtp = async ({ id }) => {
  const sql = `
    UPDATE otp_codes
    SET consumed_at = NOW()
    WHERE id = $1 AND consumed_at IS NULL
  `;
  await query(sql, [id]);
};

module.exports = { createOtp, findLatestOtp, recordOtpAttempt, consumeOtp };
