const { Pool } = require("pg");
const { env } = require("./env");

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  max: 15,
  idleTimeoutMillis: 30000,
});

const query = (text, params = []) => pool.query(text, params);

const testDbConnection = async () => {
  await query("SELECT 1");
};

module.exports = { pool, query, testDbConnection };
