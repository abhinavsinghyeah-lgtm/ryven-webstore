import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections | RYVEN",
  description: "Browse curated fragrance collections by occasion, mood, and season.",
};

const featured = [
  {
    slug: "date-night",
    name: "Date Night",
    desc: "Rich orientals and warm woods that leave an impression.",
    count: 6,
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "summer-essentials",
    name: "Summer Essentials",
    desc: "Light, fresh, aquatic scents built for Indian summers.",
    count: 8,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
];

const collections = [
  {
    slug: "office-ready",
    name: "Office Ready",
    desc: "Clean, sophisticated, never overpowering. Scents that earn compliments.",
    count: 5,
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "wedding-season",
    name: "Wedding Season",
    desc: "Grand, luxurious fragrances for celebrations that matter.",
    count: 8,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "gift-sets",
    name: "Gift Sets",
    desc: "Beautifully packaged duos and trios for any occasion.",
    count: 4,
    img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "woody-collection",
    name: "Woody Collection",
    desc: "Cedarwood, sandalwood, oud \u2014 earthy warmth for depth lovers.",
    count: 7,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "weekend-vibes",
    name: "Weekend Vibes",
    desc: "Relaxed, easy-going scents for laid-back days off.",
    count: 14,
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "under-999",
    name: "Under \u20B9999",
    desc: "Premium quality doesn\u2019t have to break the bank.",
    count: 10,
    img: "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "travel-ready",
    name: "Travel Ready",
    desc: "Compact, long-lasting companions for every journey.",
    count: 6,
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "gifting",
    name: "Gifting",
    desc: "Thoughtful fragrance gifts that always impress.",
    count: 18,
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238f8e1?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CollectionsPage() {
  return (
    <main className="collections-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="coll-hero">
          <nav className="page-breadcrumb">
            <Link href="/">Home</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span>Collections</span>
          </nav>
          <div className="coll-hero-text">
            <p className="overline">CURATED FOR YOU</p>
            <h1>Our <em>Collections</em></h1>
            <p className="coll-hero-sub">Grouped by occasion, mood and season &mdash; find your signature faster.</p>
          </div>
        </div>

        {/* Featured — 2 large cards */}
        <div className="coll-featured">
          {featured.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="coll-feat-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} />
              <div className="coll-feat-overlay">
                <span className="coll-feat-count">{c.count} products</span>
                <h2>{c.name}</h2>
                <p>{c.desc}</p>
                <span className="coll-feat-link">
                  Explore
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* All collections grid */}
        <div className="coll-section-label">
          <span>All Collections</span>
          <span className="coll-section-count">{collections.length} collections</span>
        </div>

        <div className="collections-grid">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="coll-card">
              <div className="coll-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} />
              </div>
              <div className="coll-card-body">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <div className="coll-card-meta">
                  <span className="coll-card-count">{c.count} products</span>
                  <span className="coll-card-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
