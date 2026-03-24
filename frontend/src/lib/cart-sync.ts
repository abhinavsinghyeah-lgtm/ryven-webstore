import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { clearGuestCartItems, getGuestCartItems } from "@/lib/cart-storage";
import type { CartData } from "@/types/cart";

export async function syncGuestCartAfterLogin() {
  const token = authStorage.getToken();
  if (!token) {
    return null;
  }

  const guestItems = getGuestCartItems();
  if (!guestItems.length) {
    return null;
  }

  const response = await apiRequest<{ cart: CartData }>("/cart/merge", {
    method: "POST",
    token,
    body: {
      items: guestItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    },
  });

  clearGuestCartItems();
  return response.cart;
}
