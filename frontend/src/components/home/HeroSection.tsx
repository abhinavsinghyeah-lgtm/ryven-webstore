"use client";
import { useEffect, useRef, useState } from "react";

const SOLD_PRODUCTS = [
  "Noir Velvet",
  "Rose Absolue",
  "Oud Royale",
  "Amber Eclipse",
  "Midnight Saffron",
  "Silver Mist",
];

export function HeroSection() {
  const [soldIdx, setSoldIdx] = useState(0);
  const [shoppers, setShoppers] = useState(47);

  useEffect(() => {
    const id = setInterval(() => setSoldIdx((i) => (i + 1) % SOLD_PRODUCTS.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShoppers(Math.floor(Math.random() * 30) + 30), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge anim-up">
              <span className="pulse-dot" />
              {shoppers} people shopping now
            </div>
            <h1 className="hero-title anim-up">
              Find Your Signature <em>Scent.</em>
            </h1>
            <p className="hero-sub anim-up">
              Premium fragrances that last 12+ hours. Crafted in India, inspired by the world.
              From &#x20B9;1,499.
            </p>
            <div className="hero-btns anim-up">
              <a href="/products" className="btn btn-dark">
                Shop Now&ensp;&#x2192;
              </a>
              <a href="#process" className="btn btn-outline">Our Process</a>
            </div>
            <div className="hero-stats anim-up">
              <div className="hero-stat">
                <strong>50+</strong>
                <small>Fragrances</small>
              </div>
              <div className="hero-stat">
                <strong>12,000+</strong>
                <small>Customers</small>
              </div>
              <div className="hero-stat">
                <strong>4.9&#x2605;</strong>
                <small>Rating</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
                alt="RYVEN Perfume"
              />
            </div>
            <div className="hero-float-card float-card-1">
              <div className="float-card-dot" />
              <div>
                <small>Just sold</small>
                <strong>{SOLD_PRODUCTS[soldIdx]}</strong>
              </div>
            </div>
            <div className="hero-float-card float-card-2">
              <span>&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</span>
              <small>&ldquo;Best perfume I&rsquo;ve ever owned&rdquo;</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
