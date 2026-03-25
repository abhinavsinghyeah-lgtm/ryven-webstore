import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <Link href="/products" className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4">
        Back to products
      </Link>

      <section className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-neutral-300 bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        <div className="rounded-3xl border border-neutral-300 bg-white/80 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-4 break-words text-base leading-7 text-neutral-700">{product.description}</p>

          <p className="mt-6 text-2xl font-semibold text-neutral-900">
            {formatPricePaise(product.pricePaise, product.currency)}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {product.notes.map((note) => (
              <li key={note} className="max-w-full break-words rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm text-neutral-700">
                {note}
              </li>
            ))}
          </ul>

          <AddToCartButton
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
      </section>
    </main>
  );
}
