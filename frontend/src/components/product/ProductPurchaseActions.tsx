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
    <div className="mt-6 space-y-3">
      <div className="flex gap-3">
        <div className="flex h-11 items-center rounded-lg border border-neutral-300 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="h-full w-10 text-lg text-neutral-700"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-medium text-neutral-800">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.min(9, prev + 1))}
            className="h-full w-10 text-lg text-neutral-700"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={adding}
          className="h-11 flex-1 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-70"
        >
          {adding ? "Adding..." : "Add to cart"}
        </button>
      </div>

      <button
        type="button"
        onClick={buyNow}
        disabled={adding}
        className="h-11 w-full rounded-lg border border-neutral-900 bg-white px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 disabled:opacity-70"
      >
        Buy it now
      </button>
    </div>
  );
}
