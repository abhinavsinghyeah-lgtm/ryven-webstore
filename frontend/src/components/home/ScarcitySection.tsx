import Image from "next/image";
import Link from "next/link";

import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type ScarcitySectionProps = {
  product: Product | null;
  stockLeft: number;
};

export function ScarcitySection({ product, stockLeft }: ScarcitySectionProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-8 rounded-3xl border-2 border-orange-200/60 bg-gradient-to-br from-orange-50 to-red-50 p-8 shadow-2xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] font-bold text-orange-600">Final Drop</p>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl font-bold leading-tight bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Only {stockLeft} left
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-base">
            This batch will not be restocked this month. If this profile is your match, secure it now before the next
            production cycle.
          </p>

          {product ? (
            <div className="mt-8 rounded-2xl border-2 border-orange-200/60 bg-white/70 backdrop-blur p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-600 font-bold">Scarcity product</p>
              <p className="mt-2 text-xl font-bold text-neutral-800">{product.name}</p>
              <p className="mt-2 text-lg text-orange-600 font-semibold">{formatPricePaise(product.pricePaise, product.currency)}</p>
            </div>
          ) : null}

          <Link href={product ? `/products/${product.slug}` : "/products"} className="mt-8 inline-flex brand-btn-primary">
            Claim yours now
          </Link>
        </div>

        <div className="relative min-h-[55vh] overflow-hidden rounded-2xl border-2 border-white/50 shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <Image
            src={product?.imageUrl || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1400&auto=format&fit=crop"}
            alt={product?.name || "Scarcity fragrance"}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-300/20" />
        </div>
      </div>
    </div>
  );
}
