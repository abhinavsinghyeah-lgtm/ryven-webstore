"use client";

import { useState } from "react";

import { useCart } from "@/contexts/CartContext";
import type { CartProductSnapshot } from "@/types/cart";

type AddToCartButtonProps = {
  product: CartProductSnapshot;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = async () => {
    setState("loading");

    try {
      await addToCart({ product, quantity: 1 });
      setState("done");
      setTimeout(() => setState("idle"), 900);
    } catch {
      setState("idle");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="mt-8 h-11 w-full rounded-xl bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {state === "loading" ? "Adding..." : state === "done" ? "Added" : "Add to cart"}
    </button>
  );
}
