const { z } = require("zod");

const listCollectionsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(60).optional().default(12),
    featured: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((value) => value === true || value === "true"),
  }),
});

const collectionParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    slug: z.string().trim().min(2).max(140),
  }),
});

const adminCollectionParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const collectionBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(8).max(1000),
  imageUrl: z.string().trim().url().max(500),
  featuredOnHome: z.boolean().default(false),
  homePosition: z.coerce.number().int().min(0).max(50).default(0),
  isActive: z.boolean().default(true),
  productIds: z.array(z.coerce.number().int().positive()).max(100).default([]),
});

const createCollectionSchema = z.object({
  body: collectionBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCollectionSchema = z.object({
  body: collectionBodySchema,
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  listCollectionsSchema,
  collectionParamsSchema,
  adminCollectionParamsSchema,
  createCollectionSchema,
  updateCollectionSchema,
};
