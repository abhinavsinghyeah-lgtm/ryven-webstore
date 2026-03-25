const express = require("express");

const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { requestOtpSchema, verifyOtpSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/request-otp", validate(requestOtpSchema), authController.requestOtp);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.get("/me", requireAuth, authController.me);

module.exports = router;
