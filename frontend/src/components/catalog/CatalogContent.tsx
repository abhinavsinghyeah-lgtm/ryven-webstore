"use client";

import { useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

const CATEGORIES = ["All", "Woody", "Floral", "Fresh", "Oriental"];

export function CatalogContent({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === active.toLowerCase());

  return (
    <main className="catalog-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="catalog-hero">
          <nav className="page-breadcrumb">
            <Link href="/">Home</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span>Catalog</span>
          </nav>
          <h1>All <em>Fragrances</em></h1>
          <p>Handcrafted scents for every mood, moment &amp; personality.</p>
        </div>

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <div className="catalog-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`catalog-tab${active === c ? " active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="catalog-count">{visible.length} products</span>
        </div>

        {/* Grid */}
        <div className="catalog-grid">
          {visible.length > 0 ? (
            visible.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="catalog-empty">
              <h3>No products found</h3>
              <p>Try a different category or check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
