import Image from "next/image";
import Link from "next/link";

import type { StoreSettings } from "@/types/auth";
import type { Product } from "@/types/product";

type HeroBannerSectionProps = {
  settings: StoreSettings | null;
  spotlight: Product | null;
};

const defaultHeroImage =
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop";

export function HeroBannerSection({ settings, spotlight }: HeroBannerSectionProps) {
  const heroImage = settings?.heroImageUrl || settings?.logoUrl || spotlight?.imageUrl || defaultHeroImage;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src={heroImage}
        alt={settings?.storeName || "RYVEN hero"}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.64)_42%,rgba(255,255,255,0.18)_100%)]" />
      <div className="pointer-events-none absolute -left-20 top-14 h-56 w-56 rounded-full bg-pink-200/55 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-10 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="max-w-xl rounded-[2rem] bg-white/45 p-6 backdrop-blur-md sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-pink-600">Perfume Collection</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] text-neutral-900 sm:text-6xl">
            {settings?.storeName || "RYVEN"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
            {settings?.tagline || "Soft, modern fragrances crafted to stay memorable from first spray to dry-down."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/products" className="brand-btn-primary">
              Shop Collection
            </Link>
            <Link href="/about" className="brand-btn-ghost">
              About Brand
            </Link>
          </div>

          {spotlight ? (
            <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Now Trending</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{spotlight.name}</p>
              <p className="mt-1 text-sm text-neutral-700">{spotlight.shortDescription}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}