"use client";

import Image from "next/image";
import Link from "next/link";

import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import { useCart } from "@/contexts/CartContext";
import { formatPricePaise } from "@/lib/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

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
      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Your cart is empty</h1>
        <p className="mt-2 text-neutral-600">Add a fragrance you want to keep close.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <article key={item.productId} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                <Image
                  src={item.product.imageUrl || fallbackImage}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-neutral-900">{item.product.name}</p>
                    <p className="mt-1 text-sm text-neutral-600">{formatPricePaise(item.product.pricePaise, item.product.currency)}</p>
                  </div>
                  <button
                    onClick={() => void removeFromCart(item.productId)}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-1">
                    <button
                      onClick={() => void updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="h-9 w-9 text-lg text-neutral-700 transition hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => void updateQuantity(item.productId, Math.min(20, item.quantity + 1))}
                      className="h-9 w-9 text-lg text-neutral-700 transition hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-base font-semibold text-neutral-900">{formatPricePaise(item.lineTotalPaise, item.product.currency)}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Summary</p>
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
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
        >
          Continue to Checkout
        </Link>
      </aside>
    </section>
  );
}
