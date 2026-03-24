const { z } = require("zod");

const listOrdersQuerySchema = z.object({
  q: z.string().trim().max(60).optional().default(""),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  status: z.string().trim().max(30).optional().default(""),
});

const customerOrdersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: listOrdersQuerySchema,
});

const adminOrdersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: listOrdersQuerySchema,
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

module.exports = {
  customerOrdersSchema,
  adminOrdersSchema,
  updateOrderStatusSchema,
};
