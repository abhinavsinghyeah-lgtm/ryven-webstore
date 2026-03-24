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
    <div className="min-h-screen border-b border-white/10 bg-[#0b0d10] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-6 rounded-[2rem] border border-[#ff4d4d]/35 bg-[#130a0a] p-6 shadow-[0_0_60px_rgba(255,77,77,0.15)] lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#ff8f8f]">Final Drop</p>
          <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Only {stockLeft} left</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
            This batch will not be restocked this month. If this profile is your match, secure it now before the next
            production cycle.
          </p>

          {product ? (
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Scarcity product</p>
              <p className="mt-1 text-xl font-semibold text-white">{product.name}</p>
              <p className="mt-2 text-white/80">{formatPricePaise(product.pricePaise, product.currency)}</p>
            </div>
          ) : null}

          <Link href={product ? `/products/${product.slug}` : "/products"} className="mt-7 inline-flex brand-btn-primary">
            Claim yours now
          </Link>
        </div>

        <div className="relative min-h-[55vh] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
          <Image
            src={product?.imageUrl || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1400&auto=format&fit=crop"}
            alt={product?.name || "Scarcity fragrance"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}
