import { StoreHero } from "@/components/brand/StoreHero";
import { apiRequest } from "@/lib/api";
import type { StoreSettings } from "@/types/auth";
import Link from "next/link";

async function getStoreSettings() {
  try {
    const response = await apiRequest<{ settings: StoreSettings }>("/public/store-settings");
    return response.settings;
  } catch {
    return null;
  }
}

export default async function Home() {
  const settings = await getStoreSettings();

  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <StoreHero settings={settings} />

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-neutral-300 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Phase</p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">Authentication and products are live</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Signup/login plus product listing and detail pages now run on modular backend APIs.
          </p>
        </article>
        <article className="rounded-2xl border border-neutral-300 bg-white/70 p-5 sm:translate-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Next</p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">Cart and checkout flow</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Next up is cart persistence, checkout wiring, Razorpay verification, and webhook updates.
          </p>
          <Link href="/products" className="mt-3 inline-block text-sm font-semibold text-neutral-900 underline decoration-2 underline-offset-4">
            Explore products
          </Link>
        </article>
      </section>
    </main>
  );
}
