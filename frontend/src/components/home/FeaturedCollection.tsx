import Image from "next/image";
import Link from "next/link";

import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

type FeaturedCollectionProps = {
  primary: Product | null;
  secondary: Product | null;
};

export function FeaturedCollection({ primary, secondary }: FeaturedCollectionProps) {
  const hero = primary || secondary;
  const support = secondary && primary && secondary.id !== primary.id ? secondary : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative min-h-[55vh] overflow-hidden rounded-3xl border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          {hero ? (
            <>
              <Image src={hero.imageUrl} alt={hero.name} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 52vw" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-pink-400/20" />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-pink-200 to-purple-200" />
          )}
          {hero ? (
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-bold">Featured Collection</p>
              <h3 className="mt-2 text-2xl font-bold text-neutral-800">{hero.name}</h3>
              <p className="mt-2 text-sm text-neutral-600">{hero.shortDescription}</p>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-bold">Featured collection</p>
          <h2 className="mt-3 font-display text-5xl text-neutral-800 sm:text-6xl font-bold leading-tight">Asymmetric spotlight</h2>
          {hero ? (
            <>
              <p className="mt-4 text-base text-neutral-700 leading-relaxed">{hero.description}</p>
              <p className="mt-6 text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{formatPricePaise(hero.pricePaise, hero.currency)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/products/${hero.slug}`} className="brand-btn-primary">
                  View product
                </Link>
                <Link href="/products" className="brand-btn-ghost">
                  Browse all
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 text-neutral-600">Products will appear here once catalog is available.</p>
          )}

          {support ? (
            <div className="mt-10 rounded-2xl border-2 border-pink-200/50 bg-gradient-to-br from-pink-100 to-purple-100 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-bold">Also trending</p>
              <p className="mt-2 text-lg font-semibold text-neutral-800">{support.name}</p>
              <p className="mt-1 text-sm text-neutral-700">{support.shortDescription}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
