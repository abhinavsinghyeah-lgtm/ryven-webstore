const express = require("express");

const cartController = require("../controllers/cart.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  addToCartSchema,
  updateCartSchema,
  removeCartItemSchema,
  mergeCartSchema,
} = require("../validators/cart.validator");

const router = express.Router();

router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/add", validate(addToCartSchema), cartController.addToCart);
router.put("/update", validate(updateCartSchema), cartController.updateCart);
router.delete("/remove/:productId", validate(removeCartItemSchema), cartController.removeFromCart);
router.post("/merge", validate(mergeCartSchema), cartController.mergeCart);

module.exports = router;
