import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catalog | RYVEN",
  description: "Browse the full RYVEN fragrance line-up. Modern scents crafted for everyday luxury.",
};

const staticProducts = [
  {
    slug: "noir-velvet",
    name: "Noir Velvet",
    category: "Woody &#xB7; Oud",
    desc: "Dark, magnetic fragrance with black orchid, oud wood, and smoky vanilla undertones.",
    notes: ["Black Orchid", "Oud", "Dark Vanilla"],
    price: "&#x20B9;3,749",
    oldPrice: "&#x20B9;4,999",
    badge: "SALE",
    badgeColor: "var(--pop)",
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "rose-absolue",
    name: "Rose Absolue",
    category: "Fresh &#xB7; Floral",
    desc: "Elegant rose-forward scent with dewy petals, white peony, and a hint of musk.",
    notes: ["Damask Rose", "Peony", "White Musk"],
    price: "&#x20B9;2,999",
    badge: "NEW",
    badgeColor: "var(--green)",
    img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "cedar-smoke",
    name: "Cedar Smoke",
    category: "Woody &#xB7; Aromatic",
    desc: "A campfire evening captured in a bottle. Cedarwood, birch tar, and warm amber.",
    notes: ["Cedarwood", "Birch Tar", "Amber"],
    price: "&#x20B9;2,499",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "ocean-drift",
    name: "Ocean Drift",
    category: "Fresh &#xB7; Aquatic",
    desc: "Crisp sea breeze meets bergamot and driftwood. Built for hot summer days.",
    notes: ["Sea Salt", "Bergamot", "Driftwood"],
    price: "&#x20B9;1,999",
    badge: "POPULAR",
    badgeColor: "var(--text)",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "amber-nights",
    name: "Amber Nights",
    category: "Oriental &#xB7; Warm",
    desc: "Rich amber, saffron threads, and tonka bean layered into a warm evening scent.",
    notes: ["Amber", "Saffron", "Tonka Bean"],
    price: "&#x20B9;3,299",
    badge: "SALE",
    badgeColor: "var(--pop)",
    img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "white-tea",
    name: "White Tea",
    category: "Fresh &#xB7; Clean",
    desc: "Minimalist and calming. White tea leaves, soft linen, and a whisper of jasmine.",
    notes: ["White Tea", "Linen", "Jasmine"],
    price: "&#x20B9;1,499",
    img: "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=800&auto=format&fit=crop",
  },
];

export default function ProductsPage() {
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
          <span className="catalog-count">{staticProducts.length} products</span>
          <div className="catalog-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" placeholder="Search fragrances..." readOnly />
          </div>
        </div>

        {/* Grid */}
        <div className="catalog-grid">
          {staticProducts.map((p) => (
            <article key={p.slug} className="pcard">
              <Link href={`/products/${p.slug}`}>
                <div className="pcard-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} />
                  {p.badge && (
                    <span className="pcard-tag" style={p.badgeColor ? { background: p.badgeColor } : undefined}>{p.badge}</span>
                  )}
                </div>
              </Link>
              <div className="pcard-body">
                <Link href={`/products/${p.slug}`}>
                  <span className="pcard-cat" dangerouslySetInnerHTML={{ __html: p.category }} />
                  <h3>{p.name}</h3>
                  <p className="pcard-desc">{p.desc}</p>
                </Link>
                <div className="pcard-notes">
                  {p.notes.map((n) => (
                    <span key={n} className="pcard-note">{n}</span>
                  ))}
                </div>
                <div className="pcard-bottom">
                  <span className="pcard-price">
                    <span dangerouslySetInnerHTML={{ __html: p.price }} />
                    {p.oldPrice && (
                      <span className="pcard-price-old" dangerouslySetInnerHTML={{ __html: ` ${p.oldPrice}` }} />
                    )}
                  </span>
                  <span className="pcard-action">Add to Cart</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
