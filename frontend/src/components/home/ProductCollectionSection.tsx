import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

type ProductCollectionSectionProps = {
  products: Product[];
};

export function ProductCollectionSection({ products }: ProductCollectionSectionProps) {
  return (
    <section className="bg-[#f7f5f2] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-500">Collection</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">All Live Products</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">Curated fragrances, crafted to feel modern and unmistakably premium.</p>
          </div>
          <Link href="/products" className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600 hover:text-neutral-900">
            View full catalog
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-neutral-700">No live products yet. Add products from admin to show them here.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
