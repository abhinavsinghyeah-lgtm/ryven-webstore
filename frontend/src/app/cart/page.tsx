import Link from "next/link";

import { CartPanel } from "@/components/cart/CartPanel";

export default function CartPage() {
  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Cart</p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900 sm:text-4xl">Your selections</h1>
            <p className="mt-2 text-sm text-neutral-600">Review your items and checkout when you are ready.</p>
          </div>
          <Link
            href="/products"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 hover:border-black/20"
          >
            Add more products
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <CartPanel />
      </div>
    </main>
  );
}
