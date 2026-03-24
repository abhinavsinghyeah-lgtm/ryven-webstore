const { z } = require("zod");

const quantitySchema = z.coerce.number().int().min(1).max(20);

const addToCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive(),
    quantity: quantitySchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive(),
    quantity: quantitySchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const removeCartItemSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    productId: z.coerce.number().int().positive(),
  }),
});

const mergeCartSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.coerce.number().int().positive(),
          quantity: quantitySchema,
        }),
      )
      .max(100),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
  removeCartItemSchema,
  mergeCartSchema,
};
