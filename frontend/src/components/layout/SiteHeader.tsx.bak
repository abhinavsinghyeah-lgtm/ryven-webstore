"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCart } from "@/contexts/CartContext";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { StoreSettings } from "@/types/auth";

function useCountdown(hoursFromNow: number) {
  const endRef = useRef<number>(0);
  const [time, setTime] = useState("00:00:00:00");
  useEffect(() => {
    endRef.current = Date.now() + hoursFromNow * 3600000;
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(
        `${String(d).padStart(2, "0")}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hoursFromNow]);
  return time;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hideAnnounce, setHideAnnounce] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const countdown = useCountdown(62); // ~2.5 days

  const [user] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    return authStorage.getUser();
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      setHideAnnounce(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    apiRequest<{ settings: StoreSettings }>("/store-settings")
      .then((data) => { if (alive) setSettings(data.settings); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? "hidden" : "";
      return !prev;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
  };

  const accountHref = user?.role === "admin" ? "/admin" : "/account";

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 bg-[var(--accent)] px-4 text-center text-[.78rem] font-medium text-white transition-transform duration-300"
        style={{
          height: "var(--announce-h)",
          transform: hideAnnounce ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <span>SUMMER SALE — <strong>25% OFF SITEWIDE</strong></span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="hidden sm:inline">Code: <strong>RYVEN25</strong></span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="hidden sm:inline">Ends in <strong className="font-mono">{countdown}</strong></span>
      </div>

      {/* NAV */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-[0_1px_0_var(--border)]"
            : "bg-transparent"
        }`}
        style={{
          top: hideAnnounce ? 0 : "var(--announce-h)",
          height: "var(--nav-h)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[var(--max-w)] items-center justify-between px-[var(--px)]">
          {/* Logo */}
          <Link href="/" className="text-[1.4rem] font-bold tracking-[.12em] text-[var(--text)]">
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt={settings.storeName || "RYVEN"}
                className="max-w-none object-contain"
                style={{
                  width: `${settings.logoWidthPx || 120}px`,
                  height: `${settings.logoHeightPx || 32}px`,
                }}
              />
            ) : (
              "RYVEN"
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-[.88rem] font-medium text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              Shop
            </Link>
            <Link href="/products" className="text-[.88rem] font-medium text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              Collections
            </Link>
            <Link href="/about" className="text-[.88rem] font-medium text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              Our Story
            </Link>
            <Link href="/about" className="text-[.88rem] font-medium text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen((p) => !p)}
              className="text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-[var(--text-2)] hover:text-[var(--text)] transition-colors" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--pop)] text-white text-[.65rem] font-bold px-1 transition-transform">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <Link
                href={accountHref}
                className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-white text-[.7rem] font-bold"
              >
                {user.fullName?.charAt(0).toUpperCase() || "U"}
              </Link>
            ) : (
              <Link href="/login" className="text-[var(--text-2)] hover:text-[var(--text)] transition-colors" aria-label="Login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c1.5-4 14.5-4 16 0" />
                </svg>
              </Link>
            )}

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={toggleMenu}
              className="flex md:hidden flex-col justify-center gap-[5px] w-6 h-6"
              aria-label="Menu"
            >
              <span
                className={`block h-[1.5px] w-full bg-[var(--text)] transition-transform duration-300 origin-center ${
                  menuOpen ? "translate-y-[3.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-[var(--text)] transition-transform duration-300 origin-center ${
                  menuOpen ? "-translate-y-[3.25px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="absolute right-[var(--px)] top-full mt-2 w-72 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 shadow-lg"
          >
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrances…"
              className="w-full bg-transparent text-sm outline-none text-[var(--text)] placeholder:text-[var(--text-4)]"
            />
          </form>
        )}
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[55] bg-white flex flex-col transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ paddingTop: "calc(var(--nav-h) + var(--announce-h))" }}
      >
        <div className="flex flex-col gap-1 px-6 pt-4 flex-1">
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Shop All" },
            { href: "/products", label: "Collections" },
            { href: "/about", label: "Our Story" },
            { href: "/about", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="py-3 text-[1.4rem] font-semibold text-[var(--text)] border-b border-[var(--border-light)]"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link href={accountHref} onClick={closeMenu} className="py-3 text-[1.4rem] font-semibold text-[var(--text)] border-b border-[var(--border-light)]">
              My Account
            </Link>
          ) : (
            <Link href="/login" onClick={closeMenu} className="py-3 text-[1.4rem] font-semibold text-[var(--text)] border-b border-[var(--border-light)]">
              Sign In
            </Link>
          )}
        </div>
        <div className="px-6 pb-8">
          <Link
            href="/products"
            onClick={closeMenu}
            className="btn btn-pop w-full justify-center text-center"
          >
            Shop the Sale — 25% Off
          </Link>
        </div>
      </div>
    </>
  );
}
