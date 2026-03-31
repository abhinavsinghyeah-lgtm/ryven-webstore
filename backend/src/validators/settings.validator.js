const { z } = require("zod");

const updateStoreSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().trim().min(2).max(80),
    logoUrl: z.string().trim().url().max(400),
    logoWidthPx: z.coerce.number().int().min(40).max(600),
    logoHeightPx: z.coerce.number().int().min(16).max(200),
    heroImageUrl: z.string().trim().url().max(500),
    authBackgroundUrl: z.string().trim().url().max(600).optional().or(z.literal("")),
    authBackgroundColor: z.string().trim().max(30).optional().or(z.literal("")),
    tagline: z.string().trim().min(2).max(120),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = { updateStoreSettingsSchema };
