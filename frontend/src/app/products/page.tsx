import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { apiRequest } from "@/lib/api";
import type { ProductCatalogResponse } from "@/types/product";

export const metadata: Metadata = {
  title: "Catalog | RYVEN",
  description: "Browse the full RYVEN fragrance line-up. Modern scents crafted for everyday luxury.",
};

async function getProducts() {
  try {
    return await apiRequest<ProductCatalogResponse>("/products?limit=40");
  } catch {
    return null;
  }
}

export default async function ProductsPage() {
  const data = await getProducts();
  const products = data?.products ?? [];

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
            <p>Discover modern scents crafted for everyday luxury.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <span className="catalog-count">{products.length} products</span>
        </div>

        {/* Grid */}
        <div className="catalog-grid">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-3)", padding: "60px 0" }}>
              No products available yet. Check back soon.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
