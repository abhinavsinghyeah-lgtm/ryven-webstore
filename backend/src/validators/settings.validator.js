const { z } = require("zod");

const updateStoreSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().trim().min(2).max(80),
    logoUrl: z.string().trim().url().max(400),
    heroImageUrl: z.string().trim().url().max(500),
    tagline: z.string().trim().min(2).max(120),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = { updateStoreSettingsSchema };
