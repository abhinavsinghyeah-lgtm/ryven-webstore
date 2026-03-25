"use client";

import { useState } from "react";

import { useCart } from "@/contexts/CartContext";
import type { CartProductSnapshot } from "@/types/cart";

type AnimatedAddToCartButtonProps = {
  product: CartProductSnapshot;
  className?: string;
};

export function AnimatedAddToCartButton({ product, className = "" }: AnimatedAddToCartButtonProps) {
  const { addToCart } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const onClick = async () => {
    if (state === "loading") return;
    setState("loading");
    try {
      await addToCart({ product, quantity: 1 });
      setState("done");
      window.setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("idle");
    }
  };

  const label = state === "loading" ? "Adding..." : state === "done" ? "Added" : "Add to cart";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "loading"}
      className={`cart-pearl-btn ${state === "done" ? "cart-pearl-btn--done" : ""} ${className}`.trim()}
    >
      <span className="cart-pearl-btn__shine" />
      <span className="cart-pearl-btn__inner">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
        <span>{label}</span>
      </span>
    </button>
  );
}
