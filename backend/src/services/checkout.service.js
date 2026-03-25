const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { razorpay } = require("../config/razorpay");
const { env } = require("../config/env");
const { findProductById } = require("../models/product.model");
const { findOrCreateGuestUser } = require("../models/user.model");
const { createOrder, findOrderById, findOrderByRazorpayOrderId } = require("../models/order.model");
const { clearCartByUserId } = require("../models/cart.model");
const { sendOrderConfirmation } = require("./email.service");
const { ApiError } = require("../utils/apiError");

const CHECKOUT_TOKEN_EXPIRY = "30m";

const initiateCheckout = async ({ customerInfo, address, cartItems, shippingOption = "basic" }) => {
  const normalizedPhone = customerInfo.phone.replace(/\D/g, "");
  const { user, isNew } = await findOrCreateGuestUser({
    fullName: customerInfo.fullName,
    email: customerInfo.email,
    phone: normalizedPhone,
  });

  // Verify all products and compute total server-side — never trust frontend price
  const verifiedItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await findProductById(item.productId);

      if (!product || !product.isActive) {
        throw new ApiError(400, `Product ${item.productId} is unavailable`);
      }

      return {
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        unitPricePaise: product.pricePaise,
        currency: product.currency,
        quantity: item.quantity,
        lineTotalPaise: product.pricePaise * item.quantity,
      };
    }),
  );

  const subtotalPaise = verifiedItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);
  const shippingPaise = shippingOption === "express" ? env.SHIPPING_EXPRESS_PAISE : env.SHIPPING_BASIC_PAISE;
  const totalPaise = subtotalPaise + shippingPaise;
  const currency = verifiedItems[0]?.currency || "INR";

  // Create Razorpay order with server-computed amount
  const rpOrder = await razorpay.orders.create({
    amount: totalPaise,
    currency,
    receipt: `ryven_${Date.now()}`,
  });

  // Embed verified cart and address in a short-lived checkout token
  const checkoutToken = jwt.sign(
    {
      iss: "ryven-checkout",
      userId: user.id,
      isNew,
      customerInfo: { fullName: user.fullName, email: user.email, phone: normalizedPhone },
      address,
      items: verifiedItems,
      subtotalPaise,
      shippingPaise,
      shippingService: shippingOption,
      totalPaise,
      currency,
      razorpayOrderId: rpOrder.id,
    },
    env.JWT_SECRET,
    { expiresIn: CHECKOUT_TOKEN_EXPIRY },
  );

  return {
    razorpayOrderId: rpOrder.id,
    razorpayKeyId: env.RAZORPAY_KEY_ID,
    amount: totalPaise,
    currency,
    userName: user.fullName,
    userEmail: user.email,
    checkoutToken,
  };
};

const verifyAndPersistOrder = async ({
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
  checkoutToken,
}) => {
  // Decode and validate checkout token first
  let payload;
  try {
    payload = jwt.verify(checkoutToken, env.JWT_SECRET);
  } catch {
    throw new ApiError(400, "Checkout session expired or invalid");
  }

  if (payload.iss !== "ryven-checkout") {
    throw new ApiError(400, "Invalid checkout token");
  }

  if (payload.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Order ID mismatch");
  }

  // Verify Razorpay signature — mandatory
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Payment verification failed");
  }

  const { userId, isNew, customerInfo, address, items, subtotalPaise, shippingPaise, shippingService, totalPaise, currency } = payload;

  const existingOrder = await findOrderByRazorpayOrderId(razorpayOrderId);
  if (existingOrder) {
    return {
      order: existingOrder,
      isNew,
      customerInfo,
    };
  }

  // Persist order in DB
  const order = await createOrder({
    userId,
    shippingName: customerInfo.fullName,
    shippingPhone: customerInfo.phone,
    shippingAddress: address.line,
    shippingCity: address.city,
    shippingState: address.state,
    shippingPincode: address.pincode,
    shippingCountry: address.country || "India",
    subtotalPaise,
    shippingPaise,
    shippingService,
    totalPaise,
    currency,
    razorpayOrderId,
    razorpayPaymentId,
    items,
  });

  // Clear server cart
  await clearCartByUserId(userId);

  const fullOrder = await findOrderById(order.id);

  // Send confirmation email (non-blocking)
  sendOrderConfirmation({
    to: customerInfo.email,
    order: fullOrder,
    user: { fullName: customerInfo.fullName },
  }).catch((err) => console.error("Email send failed:", err));

  return {
    order: fullOrder,
    isNew,
    customerInfo,
  };
};

const confirmAndPersistOrder = async ({ checkoutToken, razorpayOrderId }) => {
  // Validate token and order id
  let payload;
  try {
    payload = jwt.verify(checkoutToken, env.JWT_SECRET);
  } catch {
    throw new ApiError(400, "Checkout session expired or invalid");
  }

  if (payload.iss !== "ryven-checkout") {
    throw new ApiError(400, "Invalid checkout token");
  }

  if (payload.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Order ID mismatch");
  }

  const existingOrder = await findOrderByRazorpayOrderId(razorpayOrderId);
  if (existingOrder) {
    return { order: existingOrder, isNew: payload.isNew, customerInfo: payload.customerInfo };
  }

  const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
  const paidPayment = payments.items.find((item) => ["captured", "authorized"].includes(item.status));

  if (!paidPayment) {
    throw new ApiError(409, "Payment is still pending");
  }

  const signature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${paidPayment.id}`)
    .digest("hex");

  return verifyAndPersistOrder({
    razorpayPaymentId: paidPayment.id,
    razorpayOrderId,
    razorpaySignature: signature,
    checkoutToken,
  });
};

const getOrder = async ({ orderId, userId }) => {
  const order = await findOrderById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new ApiError(403, "Access denied");
  }

  return order;
};

module.exports = { initiateCheckout, verifyAndPersistOrder, confirmAndPersistOrder, getOrder };
