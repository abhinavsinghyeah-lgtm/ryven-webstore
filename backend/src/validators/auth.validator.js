const { z } = require("zod");

const signupSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    password: z.string().min(8).max(100),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(120),
    password: z.string().min(8).max(100),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const setPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8).max(100),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = { signupSchema, loginSchema, setPasswordSchema };
