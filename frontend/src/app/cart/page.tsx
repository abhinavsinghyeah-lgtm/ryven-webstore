import Link from "next/link";

import { CartPanel } from "@/components/cart/CartPanel";

export default function CartPage() {
  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Cart</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Your selections</h1>
        </div>
        <Link href="/products" className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4">
          Add more products
        </Link>
      </div>

      <CartPanel />
    </main>
  );
}
