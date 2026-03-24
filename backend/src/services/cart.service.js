const {
  getOrCreateCart,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItemByProductId,
  getCartWithItems,
} = require("../models/cart.model");
const { findProductById } = require("../models/product.model");
const { ApiError } = require("../utils/apiError");

const buildCartResponse = (rows) => {
  if (!rows.length) {
    return {
      items: [],
      subtotalPaise: 0,
      totalItems: 0,
      currency: "INR",
    };
  }

  const items = rows
    .filter((row) => row.productId && row.isActive)
    .map((row) => ({
      productId: row.productId,
      quantity: row.quantity,
      product: {
        id: row.productId,
        name: row.name,
        slug: row.slug,
        imageUrl: row.imageUrl,
        pricePaise: row.pricePaise,
        currency: row.currency,
      },
      lineTotalPaise: row.pricePaise * row.quantity,
    }));

  const subtotalPaise = items.reduce((sum, item) => sum + item.lineTotalPaise, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotalPaise,
    totalItems,
    currency: items[0]?.product.currency || "INR",
  };
};

const ensureProductExists = async (productId) => {
  const product = await findProductById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const getUserCart = async (userId) => {
  await getOrCreateCart(userId);
  const rows = await getCartWithItems(userId);
  return buildCartResponse(rows);
};

const addCartItem = async ({ userId, productId, quantity }) => {
  await ensureProductExists(productId);
  const cart = await getOrCreateCart(userId);

  try {
    await upsertCartItem({
      cartId: cart.id,
      productId,
      quantityDelta: quantity,
    });
  } catch (error) {
    if (error?.code === "23514") {
      throw new ApiError(400, "Quantity cannot exceed 20 per product");
    }
    throw error;
  }

  const refreshed = await getCartWithItems(userId);
  return buildCartResponse(refreshed);
};

const updateCartItemQuantity = async ({ userId, productId, quantity }) => {
  await ensureProductExists(productId);
  const cart = await getOrCreateCart(userId);

  const updated = await setCartItemQuantity({
    cartId: cart.id,
    productId,
    quantity,
  });

  if (!updated) {
    throw new ApiError(404, "Item not found in cart");
  }

  const refreshed = await getCartWithItems(userId);
  return buildCartResponse(refreshed);
};

const removeCartItem = async ({ userId, productId }) => {
  const cart = await getOrCreateCart(userId);
  await removeCartItemByProductId({ cartId: cart.id, productId });

  const refreshed = await getCartWithItems(userId);
  return buildCartResponse(refreshed);
};

const mergeGuestCart = async ({ userId, items }) => {
  const cart = await getOrCreateCart(userId);

  try {
    for (const item of items) {
      await ensureProductExists(item.productId);
      await upsertCartItem({
        cartId: cart.id,
        productId: item.productId,
        quantityDelta: item.quantity,
      });
    }
  } catch (error) {
    if (error?.code === "23514") {
      throw new ApiError(400, "Quantity cannot exceed 20 per product");
    }
    throw error;
  }

  const refreshed = await getCartWithItems(userId);
  return buildCartResponse(refreshed);
};

module.exports = {
  getUserCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  mergeGuestCart,
};
