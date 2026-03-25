import Image from "next/image";
import Link from "next/link";

import { AnimatedAddToCartButton } from "@/components/ui/AnimatedAddToCartButton";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-300 bg-white/80 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-22px_rgba(0,0,0,0.45)]">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-neutral-800 backdrop-blur">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/products/${product.slug}`}>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{product.name}</h3>
            <p className="mt-1 line-clamp-2 break-words text-sm text-neutral-600">{product.shortDescription}</p>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-neutral-900">
            {formatPricePaise(product.pricePaise, product.currency)}
          </p>
          <Link href={`/products/${product.slug}`} className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4">
            View
          </Link>
        </div>

        <AnimatedAddToCartButton
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
    </article>
  );
}
