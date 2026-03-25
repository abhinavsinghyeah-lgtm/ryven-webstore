const { z } = require("zod");

const initiateCheckoutSchema = z.object({
  body: z.object({
    customerInfo: z.object({
      fullName: z.string().trim().min(2).max(80),
      email: z.string().trim().email().max(120),
      phone: z.string().trim().regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone number"),
    }),
    shippingOption: z.enum(["basic", "express"]).default("basic"),
    address: z.object({
      line: z.string().trim().min(5).max(200),
      city: z.string().trim().min(2).max(60),
      state: z.string().trim().min(2).max(60),
      pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
      country: z.string().trim().default("India"),
    }),
    cartItems: z
      .array(
        z.object({
          productId: z.coerce.number().int().positive(),
          quantity: z.coerce.number().int().min(1).max(20),
        }),
      )
      .min(1)
      .max(50),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const verifyCheckoutSchema = z.object({
  body: z.object({
    razorpayPaymentId: z.string().trim().min(1),
    razorpayOrderId: z.string().trim().min(1),
    razorpaySignature: z.string().trim().min(1),
    checkoutToken: z.string().trim().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const confirmCheckoutSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().trim().min(1),
    checkoutToken: z.string().trim().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const getOrderSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

module.exports = { initiateCheckoutSchema, verifyCheckoutSchema, confirmCheckoutSchema, getOrderSchema };
