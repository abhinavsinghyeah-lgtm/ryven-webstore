import { apiRequest } from "@/lib/api";
import { formatPricePaise } from "@/lib/format";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { OccasionGrid } from "@/components/home/OccasionGrid";
import type { ProductCatalogResponse } from "@/types/product";
import type { StoreSettings } from "@/types/auth";
import Link from "next/link";
import Image from "next/image";

async function getStoreSettings() {
  try {
    const response = await apiRequest<{ settings: StoreSettings }>("/store-settings");
    return response.settings;
  } catch {
    return null;
  }
}

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=6&page=1");
  } catch {
    return { products: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 1 } };
  }
}

export default async function Home() {
  const [settings, catalog] = await Promise.all([getStoreSettings(), getProducts()]);
  const featured = catalog.products[0] ?? null;

  const slides = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop",
      title: "Launch Special",
      subtitle: "Build your scent wardrobe with bold projection and clean dry-down blends.",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop",
      title: "Own the Room",
      subtitle: "Contemporary fragrances designed to leave memory behind wherever you walk.",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1800&auto=format&fit=crop",
      title: "Signature in Motion",
      subtitle: "Everyday-ready compositions that stay clear, expressive, and long-lasting.",
    },
  ];

  return (
    <main className="page-rise -mt-[64px] pb-16">
      <HeroSlideshow slides={slides} />
      <CategoryStrip products={catalog.products} />
      <OccasionGrid />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="grid gap-6 rounded-3xl border border-neutral-300 bg-white/80 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Special pick</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">This week&apos;s spotlight scent</h2>
            {featured ? (
              <>
                <p className="mt-3 text-xl font-semibold text-neutral-900">{featured.name}</p>
                <p className="mt-2 text-sm text-neutral-700">{featured.description}</p>
                <p className="mt-4 text-lg font-semibold text-neutral-900">{formatPricePaise(featured.pricePaise, featured.currency)}</p>
                <Link href={`/products/${featured.slug}`} className="mt-5 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white">
                  Explore this fragrance
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-neutral-700">Featured fragrance will appear once products are available.</p>
            )}
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-neutral-300">
            <Image
              src={featured?.imageUrl || settings?.logoUrl || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1400&auto=format&fit=crop"}
              alt={featured?.name || "Featured fragrance"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 rounded-3xl border border-neutral-300 bg-white/75 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-neutral-300">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
            alt="RYVEN story"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">From the house</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Scent is memory in motion.</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            We started RYVEN with one belief: your fragrance should feel like your own identity, not a trend you borrow
            for a week. Every blend is built for projection, long wear, and clean dry-down on skin.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            The bottles are minimal by design. The formulas are intentional. The result is a collection that fits real
            days, real movement, and real confidence.
          </p>
          <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-neutral-900 underline decoration-2 underline-offset-4">
            Read full story
          </Link>
        </div>
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-300 bg-[#101214] px-6 py-10 text-center text-white sm:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-white/60">Ready to find your note?</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Start your RYVEN ritual today.</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900">
            Shop now
          </Link>
          <Link href="/signup" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white">
            Create account
          </Link>
        </div>
        </section>
      </div>
    </main>
  );
}
