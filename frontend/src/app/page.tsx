import { apiRequest } from "@/lib/api";
import { formatPricePaise } from "@/lib/format";
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

  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-300 bg-[#101214] text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          poster="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1500&auto=format&fit=crop"
        >
          <source src="https://cdn.coverr.co/videos/coverr-close-up-of-perfume-1591/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.24)_0%,rgba(0,0,0,0.74)_50%)]" />

        <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">New Era Fragrance House</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {settings?.storeName ?? "RYVEN"}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {settings?.tagline ?? "Performance scents with edge, built for your everyday signature."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900">
                Shop collections
              </Link>
              <Link href="/about" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white">
                Read our story
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Fast Highlights</p>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
              <li>Long-lasting profiles for humid weather</li>
              <li>Express checkout with Razorpay</li>
              <li>Curated notes designed for layering</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Collections</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Choose your signature</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-neutral-800 underline decoration-2 underline-offset-4">
            View all products
          </Link>
        </div>

        {catalog.products.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-neutral-300 bg-white/80 p-5 text-sm text-neutral-700">
            Product catalog is being curated. Check back soon.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.products.slice(0, 3).map((product) => (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-neutral-300 bg-white/85">
                <div className="relative h-52">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">{product.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-neutral-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{product.shortDescription}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 rounded-3xl border border-neutral-300 bg-white/80 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Special pick</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">This week&apos;s spotlight scent</h2>
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

      <section className="grid gap-6 rounded-3xl border border-neutral-300 bg-white/75 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
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

      <section className="rounded-2xl border border-neutral-300 bg-[#101214] px-6 py-10 text-center text-white sm:px-10">
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
    </main>
  );
}
