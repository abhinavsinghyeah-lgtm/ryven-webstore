import type { GuestCartItem } from "@/types/cart";

const GUEST_CART_KEY = "ryven_guest_cart";

export function getGuestCartItems(): GuestCartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as GuestCartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) =>
      item &&
      typeof item.productId === "number" &&
      typeof item.quantity === "number" &&
      item.quantity > 0 &&
      item.product,
    );
  } catch {
    return [];
  }
}

export function saveGuestCartItems(items: GuestCartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCartItems() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(GUEST_CART_KEY);
}
