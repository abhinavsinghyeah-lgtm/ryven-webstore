"use client";
import { useCallback } from "react";

const products = [
  { name: "Noir Velvet", cat: "woody", price: 3749, oldPrice: 4999, rating: 4.9, reviews: 2340, img: "photo-1523293182086-7651a899d37f", badge: "BESTSELLER" },
  { name: "Rose Absolue", cat: "fresh", price: 2999, oldPrice: null, rating: 4.8, reviews: 890, img: "photo-1594035910387-fea081e66b42", badge: "NEW" },
  { name: "Oud Royale", cat: "oriental", price: 4499, oldPrice: 5999, rating: 4.9, reviews: 1560, img: "photo-1590736704728-f4730bb30770", badge: "PREMIUM" },
  { name: "Amber Eclipse", cat: "oriental", price: 2499, oldPrice: null, rating: 4.7, reviews: 670, img: "photo-1557170334-a9632e77c386", badge: null },
  { name: "Midnight Saffron", cat: "woody", price: 3249, oldPrice: 3999, rating: 4.8, reviews: 430, img: "photo-1544735716-392fe2489ffa", badge: "LIMITED" },
  { name: "Silver Mist", cat: "fresh", price: 1499, oldPrice: null, rating: 4.6, reviews: 1230, img: "photo-1595425964272-fc617fa7d836", badge: null },
];

const tabs = ["all", "woody", "fresh", "oriental", "sweet"];

export function ProductGridSection() {
  const handleFilter = useCallback((cat: string) => {
    document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
    document.querySelector(`.filter-tab[data-cat="${cat}"]`)?.classList.add("active");

    document.querySelectorAll<HTMLElement>(".product-card").forEach((card) => {
      if (cat === "all" || card.dataset.cat === cat) {
        card.classList.remove("hiding");
        card.style.display = "";
      } else {
        card.classList.add("hiding");
        setTimeout(() => { card.style.display = "none"; }, 300);
      }
    });
  }, []);

  return (
    <section className="products" id="shop">
      <div className="container">
        <div className="section-top center">
          <span className="overline anim-up">OUR COLLECTION</span>
          <h2 className="section-title anim-up">Explore <em>Fragrances</em></h2>
          <p className="section-sub anim-up">Each scent is meticulously crafted with premium ingredients for lasting impression.</p>
        </div>

        <div className="filter-tabs anim-up">
          {tabs.map((t) => (
            <button
              key={t}
              className={`filter-tab${t === "all" ? " active" : ""}`}
              data-cat={t}
              onClick={() => handleFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <a href="/products" className="product-card anim-up" data-cat={p.cat} key={p.name}>
              <div className="product-img">
                <img src={`https://images.unsplash.com/${p.img}?auto=format&fit=crop&w=500&q=80`} alt={p.name} loading="lazy" />
                {p.badge && <span className="product-badge">{p.badge}</span>}
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <div className="product-rating">
                  &#x2605; {p.rating} <small>({p.reviews.toLocaleString("en-IN")})</small>
                </div>
                <div className="product-price">
                  <strong>&#x20B9;{p.price.toLocaleString("en-IN")}</strong>
                  {p.oldPrice && <span>&#x20B9;{p.oldPrice.toLocaleString("en-IN")}</span>}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="section-cta anim-up">
          <a href="/products" className="btn btn-outline">View All Fragrances &#x2192;</a>
        </div>
      </div>
    </section>
  );
}
