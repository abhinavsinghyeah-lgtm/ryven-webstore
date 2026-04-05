const express = require("express");

const authRoutes = require("./auth.routes");
const cartRoutes = require("./cart.routes");
const productRoutes = require("./product.routes");
const collectionRoutes = require("./collection.routes");
const settingsRoutes = require("./settings.routes");
const checkoutRoutes = require("./checkout.routes");
const dashboardRoutes = require("./dashboard.routes");
const adminRoutes = require("./admin.routes");
const trackRoutes = require("./track.routes");

const router = express.Router();

router.use(trackRoutes);
router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use(dashboardRoutes);
router.use(adminRoutes);
router.use(productRoutes);
router.use(collectionRoutes);
router.use(settingsRoutes);

module.exports = router;
