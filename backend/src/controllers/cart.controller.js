const cartService = require("../services/cart.service");
const { asyncHandler } = require("../utils/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getUserCart(req.user.id);
  res.status(200).json({ cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addCartItem({
    userId: req.user.id,
    productId: req.validated.body.productId,
    quantity: req.validated.body.quantity,
  });

  res.status(200).json({ cart });
});

const updateCart = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItemQuantity({
    userId: req.user.id,
    productId: req.validated.body.productId,
    quantity: req.validated.body.quantity,
  });

  res.status(200).json({ cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem({
    userId: req.user.id,
    productId: req.validated.params.productId,
  });

  res.status(200).json({ cart });
});

const mergeCart = asyncHandler(async (req, res) => {
  const cart = await cartService.mergeGuestCart({
    userId: req.user.id,
    items: req.validated.body.items,
  });

  res.status(200).json({ cart });
});

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  mergeCart,
};
