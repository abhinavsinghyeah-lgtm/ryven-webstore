import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

async function getCatalog() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=12&page=1");
  } catch {
    return { products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } };
  }
}

export default async function ProductsPage() {
  const catalog = await getCatalog();

  return (
    <main className="page-rise mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Fragrance line-up</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-neutral-700 underline decoration-2 underline-offset-4">
            Back to home
          </Link>
          <Link href="/cart" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
            Open cart
          </Link>
        </div>
      </div>

      {catalog.products.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-neutral-300 bg-white/80 p-6">
          <p className="text-neutral-700">No products found yet. Add products from admin dashboard.</p>
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
