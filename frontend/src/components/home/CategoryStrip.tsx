import Link from "next/link";

import type { Product } from "@/types/product";

type CategoryStripProps = {
  products: Product[];
};

export function CategoryStrip({ products }: CategoryStripProps) {
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 6);

  if (!categories.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-4 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Shop by Category</p>
        <Link href="/products" className="text-sm font-semibold text-neutral-800 underline decoration-2 underline-offset-4">
          See all categories
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?q=${encodeURIComponent(category)}`}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
          >
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}
