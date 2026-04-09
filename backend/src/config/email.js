const nodemailer = require("nodemailer");
const { env } = require("./env");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 8000,
  socketTimeout: 15000,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

module.exports = { transporter };
