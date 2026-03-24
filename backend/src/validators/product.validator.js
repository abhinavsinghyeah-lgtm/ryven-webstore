const { z } = require("zod");

const listProductsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    q: z.string().trim().max(60).optional().default(""),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(40).optional().default(12),
  }),
});

const productParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(2).max(140),
  }),
});

const adminProductParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const adminProductBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().trim().min(8).max(200),
  description: z.string().trim().min(20).max(1200),
  pricePaise: z.coerce.number().int().positive(),
  currency: z.string().trim().min(3).max(3),
  imageUrl: z.string().trim().url().max(500),
  notes: z.array(z.string().trim().min(2).max(80)).max(8),
  category: z.string().trim().min(2).max(60),
  isActive: z.boolean().default(true),
});

const createProductSchema = z.object({
  body: adminProductBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateProductSchema = z.object({
  body: adminProductBodySchema,
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  listProductsSchema,
  productParamsSchema,
  adminProductParamsSchema,
  createProductSchema,
  updateProductSchema,
};
