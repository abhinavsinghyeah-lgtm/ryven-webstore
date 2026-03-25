import Image from "next/image";
import Link from "next/link";

import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCollectionSectionProps = {
  products: Product[];
};

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

export function ProductCollectionSection({ products }: ProductCollectionSectionProps) {
  return (
    <section className="min-h-screen bg-[#0b0d12] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Collection</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">All Live Products</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-white/85 underline decoration-2 underline-offset-4">
            View full catalog
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/15 bg-white/5 px-6 py-10 text-center">
            <p className="text-sm text-white/80">No live products yet. Add products from admin to show them here.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[1.8rem] border border-white/15 bg-[#131722] shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.imageUrl || fallbackImage}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">{product.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/70">{product.shortDescription}</p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {formatPricePaise(product.pricePaise, product.currency)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}