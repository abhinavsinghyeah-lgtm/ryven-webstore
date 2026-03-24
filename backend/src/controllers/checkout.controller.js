const checkoutService = require("../services/checkout.service");
const { asyncHandler } = require("../utils/asyncHandler");

const initiateCheckout = asyncHandler(async (req, res) => {
  const { customerInfo, address, cartItems } = req.validated.body;
  const result = await checkoutService.initiateCheckout({ customerInfo, address, cartItems });
  res.status(200).json(result);
});

const verifyCheckout = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, checkoutToken } = req.validated.body;
  const result = await checkoutService.verifyAndPersistOrder({
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    checkoutToken,
  });
  res.status(201).json(result);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await checkoutService.getOrder({
    orderId: req.validated.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ order });
});

module.exports = { initiateCheckout, verifyCheckout, getOrder };
