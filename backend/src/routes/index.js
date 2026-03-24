const express = require("express");

const authRoutes = require("./auth.routes");
const cartRoutes = require("./cart.routes");
const productRoutes = require("./product.routes");
const settingsRoutes = require("./settings.routes");
const checkoutRoutes = require("./checkout.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use(productRoutes);
router.use(settingsRoutes);

module.exports = router;
