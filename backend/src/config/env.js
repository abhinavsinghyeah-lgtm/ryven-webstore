const { config } = require("dotenv");
const { z } = require("zod");

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  FRONTEND_URL: z.string().url(),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_SSL: z.string().default("false"),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  SKIP_RAZORPAY: z.string().default("false"),
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(""),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  SHIPPING_BASIC_PAISE: z.coerce.number().int().min(0).default(6000),
  SHIPPING_EXPRESS_PAISE: z.coerce.number().int().min(0).default(12000),
  TWILIO_ACCOUNT_SID: z.string().optional().default(""),
  TWILIO_AUTH_TOKEN: z.string().optional().default(""),
  TWILIO_FROM_NUMBER: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = {
  ...parsed.data,
  DB_SSL: parsed.data.DB_SSL === "true",
  SKIP_RAZORPAY: parsed.data.SKIP_RAZORPAY === "true",
};

if (!env.SKIP_RAZORPAY) {
  const missing = [];
  if (!env.RAZORPAY_KEY_ID) missing.push("RAZORPAY_KEY_ID");
  if (!env.RAZORPAY_KEY_SECRET) missing.push("RAZORPAY_KEY_SECRET");
  if (!env.RAZORPAY_WEBHOOK_SECRET) missing.push("RAZORPAY_WEBHOOK_SECRET");
  if (missing.length > 0) {
    console.error("Invalid environment configuration: Razorpay keys are required.");
    console.error(missing);
    process.exit(1);
  }
}

module.exports = { env };
