"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { clearGuestCartItems, getGuestCartItems, saveGuestCartItems } from "@/lib/cart-storage";
import type { CartData, CartItem, CartProductSnapshot, GuestCartItem } from "@/types/cart";

type CartContextValue = {
  cart: CartData;
  isReady: boolean;
  addToCart: (payload: { product: CartProductSnapshot; quantity?: number }) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const emptyCart: CartData = {
  items: [],
  subtotalPaise: 0,
  totalItems: 0,
  currency: "INR",
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const toCartDataFromGuest = (guestItems: GuestCartItem[]): CartData => {
  const items: CartItem[] = guestItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    lineTotalPaise: item.product.pricePaise * item.quantity,
  }));

  return {
    items,
    subtotalPaise: items.reduce((sum, item) => sum + item.lineTotalPaise, 0),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    currency: items[0]?.product.currency || "INR",
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData>(() => {
    if (typeof window === "undefined") {
      return emptyCart;
    }

    return authStorage.getToken() ? emptyCart : toCartDataFromGuest(getGuestCartItems());
  });
  const [isReady, setIsReady] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !authStorage.getToken();
  });

  useEffect(() => {
    const token = authStorage.getToken();

    if (!token) {
      return;
    }

    let isMounted = true;

    void apiRequest<{ cart: CartData }>("/cart", { token })
      .then((response) => {
        if (isMounted) {
          setCart(response.cart);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCart(emptyCart);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshCart = useCallback(async () => {
    const token = authStorage.getToken();

    if (token) {
      try {
        const response = await apiRequest<{ cart: CartData }>("/cart", { token });
        setCart(response.cart);
      } catch {
        setCart(emptyCart);
      }
      setIsReady(true);
      return;
    }

    setCart(toCartDataFromGuest(getGuestCartItems()));
    setIsReady(true);
  }, []);

  const addToCart = useCallback(async ({ product, quantity = 1 }: { product: CartProductSnapshot; quantity?: number }) => {
    const safeQuantity = Math.max(1, Math.min(quantity, 20));
    const token = authStorage.getToken();

    if (token) {
      const response = await apiRequest<{ cart: CartData }>("/cart/add", {
        method: "POST",
        token,
        body: {
          productId: product.id,
          quantity: safeQuantity,
        },
      });
      setCart(response.cart);
      return;
    }

    const guestItems = getGuestCartItems();
    const existing = guestItems.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + safeQuantity, 20);
    } else {
      guestItems.unshift({
        productId: product.id,
        quantity: safeQuantity,
        product,
      });
    }

    saveGuestCartItems(guestItems);
    setCart(toCartDataFromGuest(guestItems));
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    const safeQuantity = Math.max(1, Math.min(quantity, 20));
    const token = authStorage.getToken();

    if (token) {
      const response = await apiRequest<{ cart: CartData }>("/cart/update", {
        method: "PUT",
        token,
        body: {
          productId,
          quantity: safeQuantity,
        },
      });
      setCart(response.cart);
      return;
    }

    const guestItems = getGuestCartItems().map((item) =>
      item.productId === productId ? { ...item, quantity: safeQuantity } : item,
    );

    saveGuestCartItems(guestItems);
    setCart(toCartDataFromGuest(guestItems));
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    const token = authStorage.getToken();

    if (token) {
      const response = await apiRequest<{ cart: CartData }>(`/cart/remove/${productId}`, {
        method: "DELETE",
        token,
      });
      setCart(response.cart);
      return;
    }

    const guestItems = getGuestCartItems().filter((item) => item.productId !== productId);
    saveGuestCartItems(guestItems);
    setCart(toCartDataFromGuest(guestItems));
  }, []);

  const value = useMemo(
    () => ({ cart, isReady, addToCart, updateQuantity, removeFromCart, refreshCart }),
    [cart, isReady, addToCart, updateQuantity, removeFromCart, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function clearGuestCart() {
  clearGuestCartItems();
}
