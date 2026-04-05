"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideAnnounce, setHideAnnounce] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setHideAnnounce(y > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div
        className="announce-bar"
        style={hideAnnounce ? { transform: "translateY(-100%)" } : undefined}
      >
        <div className="announce-inner">
          <span>SUMMER SALE &mdash; <strong>25% OFF SITEWIDE</strong></span>
          <span className="announce-sep">|</span>
          <span>Code: <strong>RYVEN25</strong></span>
          <span className="announce-sep">|</span>
          <span>Ends in <strong>02:14:36:08</strong></span>
        </div>
      </div>

      <nav className={`nav${scrolled ? " scrolled" : ""}${hideAnnounce ? " hide-announce" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">RYVEN</Link>
          <ul className="nav-links">
            <li><a href="#shop">Shop</a></li>
            <li><a href="#occasion">Occasions</a></li>
            <li><a href="#process">Our Process</a></li>
            <li><a href="#bestsellers">Best Sellers</a></li>
            <li><a href="#reviews">Reviews</a></li>
          </ul>
          <div className="nav-right">
            <button className="nav-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
            <Link href="/cart" className="nav-icon" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              <span className="cart-count">2</span>
            </Link>
            <button className={`hamburger${menuOpen ? " active" : ""}`} onClick={toggleMenu} aria-label="Menu">
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <ul>
          <li><a href="#shop" onClick={closeMenu}>Shop</a></li>
          <li><a href="#occasion" onClick={closeMenu}>Occasions</a></li>
          <li><a href="#process" onClick={closeMenu}>Our Process</a></li>
          <li><a href="#bestsellers" onClick={closeMenu}>Best Sellers</a></li>
          <li><a href="#reviews" onClick={closeMenu}>Reviews</a></li>
        </ul>
        <div className="mobile-menu-cta">
          <a href="#shop" className="btn btn-dark" onClick={closeMenu}>Shop the Sale &mdash; 25% Off</a>
        </div>
      </div>
    </>
  );
}
