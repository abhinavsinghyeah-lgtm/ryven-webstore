const { Router } = require("express");
const router = Router();
const { validate } = require("../middlewares/validation.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const { initiateCheckout, verifyCheckout, confirmCheckout, completeCheckout, getOrder } = require("../controllers/checkout.controller");
const {
  initiateCheckoutSchema,
  verifyCheckoutSchema,
  confirmCheckoutSchema,
  completeCheckoutSchema,
  getOrderSchema,
} = require("../validators/checkout.validator");

router.post("/initiate", validate(initiateCheckoutSchema), initiateCheckout);
router.post("/verify", validate(verifyCheckoutSchema), verifyCheckout);
router.post("/confirm", validate(confirmCheckoutSchema), confirmCheckout);
router.post("/complete", validate(completeCheckoutSchema), completeCheckout);
router.get("/orders/:id", requireAuth, validate(getOrderSchema), getOrder);

module.exports = router;
