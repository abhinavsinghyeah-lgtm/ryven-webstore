import Image from "next/image";
import Link from "next/link";

import { AnimatedAddToCartButton } from "@/components/ui/AnimatedAddToCartButton";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:border-black/10 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl || fallbackImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 rounded-full border border-black/5 bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-neutral-700">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{product.name}</h3>
          <p className="mt-2 line-clamp-2 break-words text-sm text-neutral-600">{product.shortDescription}</p>
        </Link>

        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-neutral-900">
            {formatPricePaise(product.pricePaise, product.currency)}
          </p>
          <Link href={`/products/${product.slug}`} className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500 hover:text-neutral-900">
            View
          </Link>
        </div>

        <AnimatedAddToCartButton
          className="product-card-btn"
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.imageUrl || fallbackImage,
            pricePaise: product.pricePaise,
            currency: product.currency,
          }}
        />
      </div>
    </article>
  );
}
