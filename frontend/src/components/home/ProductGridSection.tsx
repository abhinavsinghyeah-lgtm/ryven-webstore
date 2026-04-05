"use client";

import { useState } from "react";

const PRODUCTS = [
  { cat: "woody", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80", name: "Noir Velvet", tag: "SALE", tagClass: "", catLabel: "Woody \u00B7 Oud", rating: "4.9", reviews: "2,340", notes: "Black Orchid \u00B7 Oud \u00B7 Dark Vanilla", price: "\u20B93,749", oldPrice: "\u20B94,999", sold: "1.2K sold" },
  { cat: "fresh", img: "https://images.unsplash.com/photo-1594035910387-fea081e66b42?auto=format&fit=crop&w=600&q=80", name: "Rose Absolue", tag: "NEW", tagClass: " tag-new", catLabel: "Fresh \u00B7 Floral", rating: "4.8", reviews: "890", notes: "Damask Rose \u00B7 Peony \u00B7 White Musk", price: "\u20B92,999", oldPrice: "", sold: "890 sold" },
  { cat: "oriental", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=600&q=80", name: "Oud Royale", tag: "SALE", tagClass: "", catLabel: "Oriental \u00B7 Spicy", rating: "4.9", reviews: "1,560", notes: "Saffron \u00B7 Oud \u00B7 Amber", price: "\u20B94,249", oldPrice: "\u20B95,499", sold: "1.5K sold" },
  { cat: "sweet", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80", name: "Amber Eclipse", tag: "", tagClass: "", catLabel: "Sweet \u00B7 Warm", rating: "4.7", reviews: "640", notes: "Amber \u00B7 Tonka Bean \u00B7 Vanilla", price: "\u20B92,499", oldPrice: "", sold: "640 sold" },
  { cat: "woody", img: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=80", name: "Midnight Saffron", tag: "SALE", tagClass: "", catLabel: "Woody \u00B7 Spicy", rating: "4.8", reviews: "1,120", notes: "Saffron \u00B7 Sandalwood \u00B7 Leather", price: "\u20B93,499", oldPrice: "\u20B94,499", sold: "1.1K sold" },
  { cat: "fresh", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80", name: "Silver Mist", tag: "NEW", tagClass: " tag-new", catLabel: "Fresh \u00B7 Aquatic", rating: "4.6", reviews: "320", notes: "Sea Salt \u00B7 Vetiver \u00B7 Cedar", price: "\u20B92,799", oldPrice: "", sold: "320 sold" },
];

const FILTERS = ["all", "woody", "fresh", "oriental", "sweet"];

const bagSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
);

export function ProductGridSection() {
  const [active, setActive] = useState("all");

  const visible = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

  return (
    <section className="shop" id="shop">
      <div className="container">
        <div className="section-top">
          <div>
            <span className="overline anim-up">OUR COLLECTION</span>
            <h2 className="section-title anim-up">Best Sellers &amp; <em>New Drops</em></h2>
          </div>
          <div className="filter-tabs anim-up">
            {FILTERS.map((f) => (
              <button key={f} className={`tab${active === f ? " active" : ""}`} onClick={() => setActive(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="products-grid">
          {visible.map((p) => (
            <div key={p.name} className="product-card anim-up" data-cat={p.cat}>
              <div className="product-img">
                <img src={p.img} alt={p.name} loading="lazy" />
                {p.tag && <span className={`product-tag${p.tagClass}`}>{p.tag}</span>}
                <a href="#" className="quick-add">{bagSvg} Quick Add</a>
              </div>
              <div className="product-info">
                <div className="product-meta">
                  <span className="product-cat">{p.catLabel}</span>
                  <span className="product-rating">&#x2605; {p.rating} <small>({p.reviews})</small></span>
                </div>
                <h3>{p.name}</h3>
                <p className="product-notes">{p.notes}</p>
                <div className="product-bottom">
                  <div className="product-prices">
                    <span className="price">{p.price}</span>
                    {p.oldPrice && <span className="price-old">{p.oldPrice}</span>}
                  </div>
                  <span className="product-sold">{p.sold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="shop-cta anim-up">
          <a href="#" className="btn btn-outline">View All Products</a>
        </div>
      </div>
    </section>
  );
}
