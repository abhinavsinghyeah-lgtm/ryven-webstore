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
    <div className="min-h-screen border-b border-white/10 bg-[#090a0d] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative min-h-[55vh] overflow-hidden rounded-[2rem] border border-white/15 bg-black/40">
          {hero ? (
            <Image src={hero.imageUrl} alt={hero.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {hero ? (
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Featured Collection</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{hero.name}</h3>
              <p className="mt-2 text-sm text-white/75">{hero.shortDescription}</p>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/55">Featured collection</p>
          <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">Asymmetric spotlight</h2>
          {hero ? (
            <>
              <p className="mt-4 text-base text-white/75">{hero.description}</p>
              <p className="mt-5 text-2xl font-semibold text-white">{formatPricePaise(hero.pricePaise, hero.currency)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/products/${hero.slug}`} className="brand-btn-primary">
                  View product
                </Link>
                <Link href="/products" className="brand-btn-ghost">
                  Browse all
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 text-white/70">Products will appear here once catalog is available.</p>
          )}

          {support ? (
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Also trending</p>
              <p className="mt-1 text-lg font-semibold text-white">{support.name}</p>
              <p className="mt-1 text-sm text-white/75">{support.shortDescription}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
