const { z } = require("zod");

const requestOtpSchema = z.object({
  body: z.object({
    identifier: z.string().trim().min(3).max(160),
    fullName: z.string().trim().min(2).max(80).optional(),
    email: z.string().trim().email().max(120).optional(),
    phone: z.string().trim().regex(/^\+?[0-9\s\-]{7,15}$/).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const verifyOtpSchema = z.object({
  body: z.object({
    identifier: z.string().trim().min(3).max(160),
    code: z.string().trim().regex(/^\d{4,8}$/, "Invalid OTP"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = { requestOtpSchema, verifyOtpSchema };
