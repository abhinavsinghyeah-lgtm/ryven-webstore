const crypto = require("crypto");
const express = require("express");

const { env } = require("../config/env");
const { updateOrderStatus } = require("../models/order.model");

const router = express.Router();

// Must use express.raw() so we can compute HMAC on the exact raw body bytes
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ error: "Missing signature header" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    let event;
    try {
      event = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        await updateOrderStatus({
          razorpayOrderId: payment.order_id,
          status: "paid",
          razorpayPaymentId: payment.id,
        });
      }
    }

    res.status(200).json({ received: true });
  },
);

module.exports = router;
