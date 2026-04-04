"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

const categories = [
  { label: "All", filter: "all" },
  { label: "Woody", filter: "woody" },
  { label: "Fresh", filter: "fresh" },
  { label: "Oriental", filter: "oriental" },
  { label: "Sweet", filter: "sweet" },
];

type ProductGridSectionProps = {
  products: Product[];
};

export function ProductGridSection({ products }: ProductGridSectionProps) {
  const [active, setActive] = useState("all");
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const formatPrice = (paise: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

  const handleAdd = async (product: Product) => {
    setAddedId(product.id);
    try {
      await addToCart({
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          pricePaise: product.pricePaise,
          currency: "INR",
        },
        quantity: 1,
      });
    } catch {
      // ignore
    }
    setTimeout(() => setAddedId(null), 1500);
  };

  // Filter by category if products have it
  const filtered = active === "all"
    ? products
    : products.filter((p) => p.category?.toLowerCase() === active);

  return (
    <section id="shop" className="py-20 px-[var(--px)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[var(--max-w)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div className="anim-up">
            <span className="section-tag">✦ Our Collection</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">Explore Fragrances</h2>
          </div>
          {/* Filter tabs */}
          <div className="filter-tabs anim-up">
            {categories.map((c) => (
              <button
                key={c.filter}
                onClick={() => setActive(c.filter)}
                className={`tab ${active === c.filter ? "active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-white px-6 py-12 text-center">
            <p className="text-sm text-[var(--text-2)]">No products found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group rounded-[var(--radius)] bg-white border border-[var(--border-light)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg anim-up"
              >
                {/* Image */}
                <Link href={`/products/${product.slug}`} className="block aspect-[3/4] overflow-hidden bg-[var(--bg-warm)] relative">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl text-[var(--text-4)]">🌿</div>
                  )}
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 text-[.7rem] font-semibold text-[var(--text-2)] px-3 py-1 rounded-full uppercase tracking-wide">
                      {product.category}
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="p-5">
                  {product.notes && product.notes.length > 0 && (
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {product.notes.slice(0, 3).map((note) => (
                        <span key={note} className="text-[.68rem] bg-[var(--bg-warm)] text-[var(--text-3)] px-2 py-0.5 rounded-full">
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--pop)] transition-colors">{product.name}</h3>
                  </Link>
                  {product.shortDescription && (
                    <p className="text-xs text-[var(--text-3)] mt-1 line-clamp-1">{product.shortDescription}</p>
                  )}
                  <p className="text-lg font-bold text-[var(--text)] mt-3">{formatPrice(product.pricePaise)}</p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="quick-add mt-3"
                  >
                    {addedId === product.id ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 anim-up">
          <Link href="/products" className="btn btn-outline">
            View All Fragrances →
          </Link>
        </div>
      </div>
    </section>
  );
}
