const { z } = require("zod");

const paginationSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

const controlActionSchema = z.object({
  body: z.object({
    action: z.enum(["restart-frontend", "restart-backend", "reload-nginx"]),
    secret: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "customer"]),
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).optional(),
});

const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  paginationSchema,
  controlActionSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
};
