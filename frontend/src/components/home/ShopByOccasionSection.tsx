import Image from "next/image";
import Link from "next/link";

import type { Collection } from "@/types/collection";

type ShopByOccasionSectionProps = {
  collections: Collection[];
};

export function ShopByOccasionSection({ collections }: ShopByOccasionSectionProps) {
  const shown = collections.slice(0, 4);

  return (
    <section className="flex min-h-screen items-center bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-neutral-500">Collections</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Shop by Occasion
          </h1>
          <p className="mt-5 text-base leading-8 text-neutral-600 sm:text-lg">
            Discover fragrances crafted for every moment of your life. From effortless everyday wear to bold, unforgettable occasions.
          </p>
        </div>

        {shown.length === 0 ? (
          <div className="mt-14 rounded-[32px] border border-black/5 bg-neutral-50 px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-neutral-700">Feature collections from admin to populate this section.</p>
          </div>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {shown.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block"
              >
                <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="px-4 py-5 text-center">
                    <h2 className="text-2xl font-medium tracking-tight text-neutral-900">{collection.name}</h2>
                    <p className="mt-2 text-sm text-neutral-500">{collection.productCount} products</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
