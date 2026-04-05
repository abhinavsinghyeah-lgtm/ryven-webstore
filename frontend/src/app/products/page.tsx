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
    <main className="catalog-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="page-hero">
          <div className="page-hero-inner">
            <nav className="page-breadcrumb">
              <Link href="/">Home</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span>Catalog</span>
            </nav>
            <p className="overline">Catalog</p>
            <h1>Fragrance Line-up</h1>
            {q ? (
              <p>Showing results for &#x201C;{q}&#x201D;</p>
            ) : (
              <p>Discover modern scents crafted for everyday luxury.</p>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <span className="catalog-count">
            {catalog.products.length} product{catalog.products.length !== 1 && "s"}
          </span>
          <form action="/products" method="GET" className="catalog-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" name="q" placeholder="Search fragrances..." defaultValue={q} />
          </form>
        </div>

        {/* Grid */}
        {catalog.products.length === 0 ? (
          <div className="catalog-grid">
            <div className="catalog-empty">
              <h3>No products found</h3>
              <p>{q ? "Try a different search term." : "Products will appear here once added from the admin dashboard."}</p>
            </div>
          </div>
        ) : (
          <div className="catalog-grid">
            {catalog.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
