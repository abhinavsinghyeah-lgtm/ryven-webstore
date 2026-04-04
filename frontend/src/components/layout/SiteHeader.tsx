"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdownRef = useRef<HTMLSpanElement>(null);
  const { cart } = useCart();
  const cartCount = cart.totalItems;

  /* countdown timer — ends in ~2.5 days */
  useEffect(() => {
    const end = Date.now() + 2.5 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const d = Math.max(0, end - Date.now());
      const h = String(Math.floor(d / 3600000)).padStart(2, "0");
      const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
      if (countdownRef.current) countdownRef.current.textContent = `${h}:${m}:${s}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* scroll behaviour — hide announce bar + shrink nav */
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const nav = document.querySelector(".nav") as HTMLElement | null;
      const announce = document.querySelector(".announce-bar") as HTMLElement | null;
      if (!nav) return;
      if (y > 100) {
        nav.classList.add("scrolled");
        announce?.classList.add("hide-announce");
      } else {
        nav.classList.remove("scrolled");
        announce?.classList.remove("hide-announce");
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announce-bar">
        <div className="announce-inner">
          <span>
            &#x20B9;500 OFF on first order&nbsp;
            <span className="announce-sep">|</span>&nbsp;
            Sale ends in <span ref={countdownRef}>00:00:00</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">RYVEN</Link>

          <div className="nav-links">
            <Link href="/products">Shop All</Link>
            <Link href="/products?category=bestsellers">Bestsellers</Link>
            <Link href="/products?category=new">New Arrivals</Link>
            <a href="#process">Our Process</a>
          </div>

          <div className="nav-right">
            <Link href="/products" className="nav-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </Link>
            <Link href="/account" className="nav-icon" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <Link href="/cart" className="nav-icon" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <button
              className={`hamburger${menuOpen ? " active" : ""}`}
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        <Link href="/products" onClick={() => setMenuOpen(false)}>Shop All</Link>
        <Link href="/products?category=bestsellers" onClick={() => setMenuOpen(false)}>Bestsellers</Link>
        <Link href="/products?category=new" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
        <a href="#process" onClick={() => setMenuOpen(false)}>Our Process</a>
        <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
        <div className="mobile-menu-cta">
          <Link href="/products" className="btn btn-dark" onClick={() => setMenuOpen(false)}>Shop Now</Link>
        </div>
      </div>
    </>
  );
}
