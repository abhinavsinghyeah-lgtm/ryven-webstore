"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeroSection() {
  const [shopCount, setShopCount] = useState("3,240");
  const [soldProduct, setSoldProduct] = useState({ name: "Noir Velvet", time: "12s ago" });

  const soldProducts = [
    { name: "Noir Velvet", time: "12s ago" },
    { name: "Rose Absolue", time: "34s ago" },
    { name: "Oud Royale", time: "1m ago" },
    { name: "Amber Eclipse", time: "2m ago" },
    { name: "Midnight Saffron", time: "3m ago" },
    { name: "Silver Mist", time: "4m ago" },
  ];

  useEffect(() => {
    let idx = 0;
    const soldInterval = setInterval(() => {
      idx = (idx + 1) % soldProducts.length;
      setSoldProduct(soldProducts[idx]);
    }, 4000);

    const countInterval = setInterval(() => {
      const variance = Math.floor(Math.random() * 200) - 100;
      setShopCount((3240 + variance).toLocaleString());
    }, 8000);

    return () => {
      clearInterval(soldInterval);
      clearInterval(countInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen bg-[var(--bg-warm)] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-warm)] via-[var(--bg)] to-white" />

      <div className="relative mx-auto max-w-[var(--max-w)] w-full px-[var(--px)] py-24 md:py-32">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[var(--border)] px-4 py-2 mb-8 anim-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
          </span>
          <span className="text-[.8rem] text-[var(--text-2)]">{shopCount} people shopping right now</span>
        </div>

        <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] text-[var(--text)] max-w-3xl anim-up">
          Find Your{" "}
          <em className="font-serif not-italic text-[var(--pop)]" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Signature
          </em>{" "}
          Scent
        </h1>

        <p className="mt-6 text-lg text-[var(--text-2)] max-w-xl leading-relaxed anim-up">
          Premium Indian-crafted fragrances that last 12+ hours. Bold, clean, and designed for those who refuse to blend in.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 anim-up">
          <Link href="/products" className="btn btn-primary">
            Shop Collection
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="#process" className="btn btn-outline">Our Process</Link>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap gap-10 anim-up">
          <div>
            <p className="text-3xl font-bold text-[var(--text)]">50+</p>
            <p className="text-sm text-[var(--text-3)] mt-1">Fragrances</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--text)]">12,000+</p>
            <p className="text-sm text-[var(--text-3)] mt-1">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--text)]">4.9 ★</p>
            <p className="text-sm text-[var(--text-3)] mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Floating cards (desktop) */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
        {/* Just sold card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--border-light)] px-5 py-4 mb-4 w-56 transition-all duration-300">
          <strong className="text-xs text-[var(--green)]">Just sold</strong>
          <p className="text-sm text-[var(--text)] mt-1">{soldProduct.name} — {soldProduct.time}</p>
        </div>
        {/* Review card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--border-light)] px-5 py-4 w-56 soft-float">
          <div className="text-[var(--pop)] text-sm">★★★★★</div>
          <p className="text-xs text-[var(--text-2)] mt-2 italic">&quot;Best fragrance I&apos;ve ever owned. Compliments all day.&quot;</p>
          <p className="text-[.7rem] text-[var(--text-4)] mt-2">— Verified Buyer</p>
        </div>
      </div>
    </section>
  );
}
