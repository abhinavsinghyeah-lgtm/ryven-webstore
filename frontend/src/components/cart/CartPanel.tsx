"use client";

import Link from "next/link";

import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import { useCart } from "@/contexts/CartContext";
import { formatPricePaise } from "@/lib/format";

export function CartPanel() {
  const { cart, isReady, updateQuantity, removeFromCart } = useCart();

  if (!isReady) {
    return (
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ContentSkeleton key={index} rows={4} className="min-h-[160px]" />
          ))}
        </div>
        <ContentSkeleton rows={4} showAvatar={false} className="min-h-[260px]" />
      </section>
    );
  }

  if (!cart.items.length) {
    return (
      <section className="rounded-2xl border border-neutral-300 bg-white/80 p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Your cart is empty</h1>
        <p className="mt-2 text-neutral-600">Add a fragrance you want to keep close.</p>
        <Link
          href="/products"
          className="mt-5 inline-block rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {cart.items.map((item) => (
          <article key={item.productId} className="rounded-2xl border border-neutral-300 bg-white/80 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-neutral-900">{item.product.name}</p>
                <p className="mt-1 text-sm text-neutral-600">{formatPricePaise(item.product.pricePaise, item.product.currency)}</p>
              </div>
              <button
                onClick={() => void removeFromCart(item.productId)}
                className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4"
              >
                Remove
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white">
                <button
                  onClick={() => void updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  className="h-9 w-9 text-lg text-neutral-700 transition hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="min-w-10 text-center text-sm font-medium text-neutral-900">{item.quantity}</span>
                <button
                  onClick={() => void updateQuantity(item.productId, Math.min(20, item.quantity + 1))}
                  className="h-9 w-9 text-lg text-neutral-700 transition hover:bg-neutral-100"
                >
                  +
                </button>
              </div>

              <p className="text-base font-semibold text-neutral-900">{formatPricePaise(item.lineTotalPaise, item.product.currency)}</p>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-neutral-300 bg-white/90 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Summary</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-neutral-700">
            <span>Items</span>
            <span>{cart.totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-900">
            <span className="font-semibold">Subtotal</span>
            <span className="font-semibold">{formatPricePaise(cart.subtotalPaise, cart.currency)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          Continue to Checkout →
        </Link>
      </aside>
    </section>
  );
}
