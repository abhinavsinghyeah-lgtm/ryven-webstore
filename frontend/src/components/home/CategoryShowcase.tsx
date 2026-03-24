import Link from "next/link";

import type { Product } from "@/types/product";

type CategoryShowcaseProps = {
  products: Product[];
};

export function CategoryShowcase({ products }: CategoryShowcaseProps) {
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 6);

  return (
    <div className="min-h-screen border-b border-white/10 bg-[#0b0d10] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/55">Shop by Category</p>
        <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Build your fragrance stack</h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {categories.length ? (
            categories.map((category) => (
              <Link key={category} href={`/products?q=${encodeURIComponent(category)}`} className="category-chip">
                {category}
              </Link>
            ))
          ) : (
            <p className="text-sm text-white/70">Categories will appear once products are available.</p>
          )}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          Layer fresh top notes with resinous bases, or keep one clean profile as your signature. Each category is tuned
          for a distinct projection and skin evolution.
        </p>
      </div>
    </div>
  );
}
