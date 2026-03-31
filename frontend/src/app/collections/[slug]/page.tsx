import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { CollectionDetailResponse } from "@/types/collection";

async function getCollection(slug: string) {
  try {
    return await apiRequest<CollectionDetailResponse>(`/collections/${slug}`);
  } catch {
    return null;
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCollection(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.collection.imageUrl} alt={data.collection.name} className="h-[360px] w-full object-cover sm:h-[420px]" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Collection</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">{data.collection.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{data.collection.description}</p>
            </div>
            <Link href="/collections" className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 hover:border-black/20">
              All collections
            </Link>
          </div>
        </div>
      </section>

      {data.products.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-neutral-700">No products are linked to this collection yet.</p>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
