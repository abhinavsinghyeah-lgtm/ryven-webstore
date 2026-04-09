import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

async function getCatalog(search: string) {
  const query = search ? `&q=${encodeURIComponent(search)}` : "";
  try {
    return await apiRequest<ProductCatalogResponse>(`/products?limit=12&page=1${query}`);
  } catch {
    return { products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const catalog = await getCatalog(q);

  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Catalog</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">Fragrance line-up</h1>
            {q ? (
              <p className="mt-2 text-sm text-neutral-600">Filtered by: {q}</p>
            ) : (
              <p className="mt-2 text-sm text-neutral-600">Discover modern scents crafted for everyday luxury.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 hover:border-black/20">
              Back to home
            </Link>
            <Link href="/cart" className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-sm transition hover:bg-neutral-800">
              Open cart
            </Link>
          </div>
        </div>
      </section>

      {catalog.products.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-neutral-700">No products found yet. Add products from admin dashboard.</p>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
