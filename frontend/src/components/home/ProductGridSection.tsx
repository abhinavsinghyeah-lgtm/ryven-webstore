"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { AnimatedAddToCartButton } from "@/components/ui/AnimatedAddToCartButton";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop";

const CATEGORIES = ["All", "Woody", "Floral", "Fresh", "Oriental"];

export function ProductGridSection({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === active.toLowerCase());

  return (
    <section className="shop" id="shop">
      <div className="container">
        <div className="section-top">
          <div>
            <span className="overline anim-up">OUR COLLECTION</span>
            <h2 className="section-title anim-up">Best Sellers &amp; <em>New Drops</em></h2>
          </div>
          <div className="filter-tabs anim-up">
            {CATEGORIES.map((f) => (
              <button key={f} className={`tab${active === f ? " active" : ""}`} onClick={() => setActive(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {visible.map((p) => {
            const notes = Array.isArray(p.notes) ? p.notes.filter((n) => n.trim()).slice(0, 3) : [];
            return (
              <div key={p.id} className="product-card anim-up" data-cat={p.category?.toLowerCase()}>
                <Link href={`/products/${p.slug}`}>
                  <div className="product-img">
                    <Image
                      src={p.imageUrl || fallbackImage}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    {p.category && <span className="product-tag tag-new">{p.category}</span>}
                  </div>
                </Link>
                <div className="product-info">
                  <div className="product-meta">
                    <span className="product-cat">{p.category || "Fragrance"}</span>
                  </div>
                  <Link href={`/products/${p.slug}`}><h3>{p.name}</h3></Link>
                  {notes.length > 0 && (
                    <p className="product-notes">{notes.join(" · ")}</p>
                  )}
                  <div className="product-bottom">
                    <span className="price">{formatPricePaise(p.pricePaise, p.currency)}</span>
                    <AnimatedAddToCartButton
                      product={{
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        imageUrl: p.imageUrl || fallbackImage,
                        pricePaise: p.pricePaise,
                        currency: p.currency,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shop-cta anim-up">
          <Link href="/products" className="btn btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  );
}
