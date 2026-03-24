const express = require("express");

const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { signupSchema, loginSchema, setPasswordSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);
router.post("/set-password", validate(setPasswordSchema), authController.setPassword);

module.exports = router;
