"use client";

import { useState } from "react";
import Link from "next/link";

import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { formatPricePaise } from "@/lib/format";
import type { Product } from "@/types/product";

/* ── Shared star SVG ── */
function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );
}

/* ── Enrichment types ── */
export type ProductEnrichment = {
  thumbs?: string[];
  details: { title: string; body: string }[];
  reviews: {
    avg: number;
    total: number;
    bars: number[];
    list: {
      name: string;
      initials: string;
      stars: number;
      date: string;
      text: string;
      verified?: boolean;
    }[];
  };
};

type ProductDetailViewProps = {
  product: Product;
  enrichment: ProductEnrichment;
  related: { slug: string; name: string; price: string; img: string; category: string }[];
};

export function ProductDetailView({ product, enrichment, related }: ProductDetailViewProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [openDetails, setOpenDetails] = useState<Set<number>>(new Set([0]));

  const images = [product.imageUrl, ...(enrichment.thumbs || [])];
  const comparePricePaise = Math.round(product.pricePaise * 1.25);
  const savePercent = Math.round((1 - product.pricePaise / comparePricePaise) * 100);

  const toggleDetail = (idx: number) => {
    setOpenDetails((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <main className="pdp">
      <div className="wrapper">
        {/* ── Grid ── */}
        <div className="pdp-grid">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-img-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[activeThumb]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`pdp-thumb${i === activeThumb ? " active" : ""}`}
                    onClick={() => setActiveThumb(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pdp-info">
            {/* Breadcrumb */}
            <nav className="pdp-breadcrumb">
              <Link href="/">Home</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <Link href="/products">Catalog</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span>{product.name}</span>
            </nav>

            <p className="pdp-category">{product.category}</p>
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-subtitle">{product.shortDescription}</p>

            {/* Rating */}
            <div className="pdp-rating">
              <div className="pdp-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <span className="pdp-rating-text">
                {enrichment.reviews.avg} · {enrichment.reviews.total} reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="pdp-pricing">
              <span className="pdp-price">{formatPricePaise(product.pricePaise, product.currency)}</span>
              <span className="pdp-price-old">{formatPricePaise(comparePricePaise, product.currency)}</span>
              <span className="pdp-price-save">Save {savePercent}%</span>
            </div>

            {/* Purchase actions */}
            <ProductPurchaseActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                imageUrl: product.imageUrl,
                pricePaise: product.pricePaise,
                currency: product.currency,
              }}
            />

            {/* Notes */}
            {product.notes.length > 0 && (
              <div className="pdp-notes-section">
                <p className="pdp-notes-label">Fragrance Notes</p>
                <div className="pdp-notes-list">
                  {product.notes.map((n) => (
                    <span key={n} className="pdp-note-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 8v4m0 4h.01" /></svg>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details accordion */}
            <div className="pdp-details">
              {enrichment.details.map((d, i) => (
                <div key={i} className={`pdp-detail-block${openDetails.has(i) ? " open" : ""}`}>
                  <button className="pdp-detail-header" onClick={() => toggleDetail(i)}>
                    {d.title}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <div className="pdp-detail-body" dangerouslySetInnerHTML={{ __html: d.body }} />
                </div>
              ))}
            </div>

            {/* Guarantees */}
            <div className="pdp-guarantees">
              <div className="pdp-guarantee">
                <div className="pdp-guarantee-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                </div>
                <span>Free Shipping ₹499+</span>
              </div>
              <div className="pdp-guarantee">
                <div className="pdp-guarantee-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" /><path d="M12 8v4l3 3" /></svg>
                </div>
                <span>7-Day Easy Returns</span>
              </div>
              <div className="pdp-guarantee">
                <div className="pdp-guarantee-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </div>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <section className="pdp-reviews">
          <div className="pdp-reviews-header">
            <div>
              <h2>Customer Reviews</h2>
              <div className="pdp-reviews-summary" style={{ marginTop: 12 }}>
                <span className="pdp-reviews-big">{enrichment.reviews.avg}</span>
                <div className="pdp-reviews-meta">
                  <div className="pdp-stars" style={{ marginBottom: 4 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon key={i} size={16} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                    Based on {enrichment.reviews.total} reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="pdp-reviews-bars">
              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={star} className="pdp-reviews-bar-row">
                  <span>{star}★</span>
                  <div className="pdp-reviews-bar">
                    <span style={{ width: `${enrichment.reviews.bars[i]}%` }} />
                  </div>
                  <span>{enrichment.reviews.bars[i]}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdp-reviews-grid">
            {enrichment.reviews.list.map((r, i) => (
              <div key={i} className="pdp-review-card">
                <div className="pdp-review-top">
                  <div className="pdp-review-stars">
                    {Array.from({ length: r.stars }, (_, j) => (
                      <StarIcon key={j} />
                    ))}
                  </div>
                  <span className="pdp-review-date">{r.date}</span>
                </div>
                <p className="pdp-review-text">{r.text}</p>
                <div className="pdp-review-author">
                  <div className="pdp-review-avatar">{r.initials}</div>
                  <div>
                    <div className="pdp-review-name">{r.name}</div>
                    {r.verified && (
                      <span className="pdp-review-verified">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── You May Also Like ── */}
        {related.length > 0 && (
          <section className="pdp-related">
            <h2>You May Also Like</h2>
            <div className="pdp-related-grid">
              {related.map((r) => (
                <article key={r.slug} className="pcard">
                  <Link href={`/products/${r.slug}`}>
                    <div className="pcard-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.img} alt={r.name} />
                    </div>
                  </Link>
                  <div className="pcard-body">
                    <Link href={`/products/${r.slug}`}>
                      <span className="pcard-cat" dangerouslySetInnerHTML={{ __html: r.category }} />
                      <h3>{r.name}</h3>
                    </Link>
                    <div className="pcard-foot">
                      <span className="pcard-price">{r.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
