"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/contexts/CartContext";
import type { CartProductSnapshot } from "@/types/cart";

type ProductPurchaseActionsProps = {
  product: CartProductSnapshot;
};

export function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addToCart({ product, quantity });
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addToCart({ product, quantity });
      router.push("/checkout");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="pdp-actions">
      <div className="pdp-qty">
        <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>−</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((prev) => Math.min(9, prev + 1))}>+</button>
      </div>
      <div className="pdp-btn-row">
        <button type="button" className="btn btn-dark" onClick={add} disabled={adding}>
          {adding ? "Adding…" : "Add to Cart"}
        </button>
        <button type="button" className="btn btn-outline" onClick={buyNow} disabled={adding}>
          Buy it Now
        </button>
      </div>
    </div>
  );
}
