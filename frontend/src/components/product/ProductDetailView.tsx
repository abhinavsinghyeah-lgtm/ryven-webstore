import Image from "next/image";
import Link from "next/link";

import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const comparePricePaise = Math.round(product.pricePaise * 1.25);

  return (
    <main className="page-rise mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
      <Link href="/products" className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4">
        Back to products
      </Link>

      <section className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <div className="relative min-h-[640px] overflow-hidden rounded-sm border border-neutral-300 bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
        </div>

        <div className="pt-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{product.category}</p>
          <h1 className="mt-2 font-display text-5xl text-neutral-900 sm:text-6xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3 text-lg">
            <span className="font-semibold text-neutral-900">{formatPricePaise(product.pricePaise, product.currency)}</span>
            <span className="text-neutral-500 line-through">{formatPricePaise(comparePricePaise, product.currency)}</span>
          </div>

          <div className="mt-6 border-t border-neutral-300 pt-5">
            <ProductPurchaseActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                imageUrl: product.imageUrl,
                pricePaise: product.pricePaise,
                currency: product.currency,
              }}
            />
          </div>

          <div className="mt-7 space-y-4 text-neutral-700">
            <p className="italic">{product.shortDescription}</p>
            <p className="break-words leading-7">{product.description}</p>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {product.notes.map((note) => (
              <li key={note} className="max-w-full break-words rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm text-neutral-700">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
