import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections | RYVEN",
  description: "Browse curated fragrance collections by occasion, mood, and season.",
};

const staticCollections = [
  {
    slug: "summer-essentials",
    name: "Summer Essentials",
    desc: "Light, fresh, aquatic scents built for Indian summers. Stay cool, smell incredible.",
    count: 8,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "date-night",
    name: "Date Night",
    desc: "Rich orientals and warm woods that leave an impression. Designed for evenings out.",
    count: 6,
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "office-ready",
    name: "Office Ready",
    desc: "Clean, sophisticated, never overpowering. Scents that earn compliments at work.",
    count: 5,
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "gift-sets",
    name: "Gift Sets",
    desc: "Beautifully packaged duos and trios. The perfect fragrance gift for any occasion.",
    count: 4,
    img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "woody-collection",
    name: "Woody Collection",
    desc: "Cedarwood, sandalwood, oud &#x2014; earthy warmth for those who love depth.",
    count: 7,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "under-999",
    name: "Under &#x20B9;999",
    desc: "Premium quality doesn&#x2019;t have to break the bank. Our best picks under a thousand.",
    count: 10,
    img: "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CollectionsPage() {
  return (
    <main className="collections-page">
      <div className="wrapper">
        {/* Hero */}
        <div className="page-hero">
          <div className="page-hero-inner">
            <nav className="page-breadcrumb">
              <Link href="/">Home</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span>Collections</span>
            </nav>
            <p className="overline">Collections</p>
            <h1>Browse by Collection</h1>
            <p>Curated edits grouped by occasion, mood, season &#x2014; find your signature faster.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="collections-grid" style={{ marginTop: 28 }}>
          {staticCollections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="coll-card">
              <div className="coll-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} />
              </div>
              <div className="coll-card-body">
                <h3 dangerouslySetInnerHTML={{ __html: c.name }} />
                <p dangerouslySetInnerHTML={{ __html: c.desc }} />
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
