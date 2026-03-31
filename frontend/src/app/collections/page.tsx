import Link from "next/link";

import { apiRequest } from "@/lib/api";
import type { CollectionCatalogResponse } from "@/types/collection";

async function getCollections() {
  try {
    return await apiRequest<CollectionCatalogResponse>("/collections?limit=40&page=1");
  } catch {
    return { collections: [], pagination: { page: 1, limit: 40, total: 0, totalPages: 1 } };
  }
}

export default async function CollectionsPage() {
  const data = await getCollections();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Collections</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">Browse by collection</h1>
        <p className="mt-3 text-sm text-neutral-600">Explore grouped edits like occasion, size, freshness, or gifting.</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={collection.imageUrl} alt={collection.name} className="h-72 w-full rounded-[20px] object-cover" />
            <h2 className="mt-4 text-2xl font-semibold text-neutral-900">{collection.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{collection.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">{collection.productCount} products</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
