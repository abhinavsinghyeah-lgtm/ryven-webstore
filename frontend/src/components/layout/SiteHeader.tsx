"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/contexts/CartContext";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { StoreSettings } from "@/types/auth";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");
  const [isPastHero, setIsPastHero] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [user] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return authStorage.getUser();
  });

  useEffect(() => {
    const onScroll = () => {
      setIsPastHero(window.scrollY > 56);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    apiRequest<{ settings: StoreSettings }>("/store-settings")
      .then((data) => {
        if (alive) {
          setSettings(data.settings);
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setSearchOpen(false);
  };

  const transparent = isHome && !isPastHero;
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "Account";
  const accountHref = user?.role === "admin" ? "/admin" : "/account";

  const headerClass = transparent
    ? "fixed top-0 z-50 w-full border-transparent bg-transparent text-white"
    : isAdmin
      ? "sticky top-0 z-50 w-full border-b border-black/5 bg-[#f7f5f2] text-neutral-900"
      : "sticky top-0 z-50 w-full border-b border-black/5 bg-[#f4f4f2] text-neutral-900";

  const subtleLinkClass = transparent
    ? "text-sm font-medium text-white/80 hover:text-white transition-colors"
    : "text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors";

  const iconClass = transparent ? "text-white/85 hover:text-white" : "text-neutral-800 hover:text-neutral-900";

  const logoClass = transparent
    ? "text-sm font-semibold tracking-[0.5em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
    : "text-sm font-semibold tracking-[0.5em] text-neutral-900";

  return (
    <header className={headerClass}>
      <div className="mx-auto w-full max-w-6xl px-5 py-2 sm:px-8">
        <div className="relative grid min-h-[56px] grid-cols-[auto_1fr_auto] items-center gap-5">
          <Link href="/" className="flex items-center gap-3">
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
              <span className={logoClass}>RYVEN</span>
            )}
          </Link>

          <nav className="hidden items-center justify-center gap-6 md:flex">
            <Link href="/" className={subtleLinkClass}>
              Home
            </Link>
            <Link href="/products" className={subtleLinkClass}>
              Catalog
            </Link>
            <Link href="/about" className={subtleLinkClass}>
              About us
            </Link>
            <Link href="/about" className={subtleLinkClass}>
              Contact
            </Link>
            <Link href="/about" className={subtleLinkClass}>
              Terms
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className={`transition ${iconClass}`}
              aria-label="Search catalog"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>

            <Link href="/cart" className={`relative ${iconClass}`} aria-label="Open cart">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7" />
                <circle cx="10" cy="19" r="1.4" />
                <circle cx="17" cy="19" r="1.4" />
              </svg>
              {cart.totalItems > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-white text-[9px] font-semibold text-black">
                  {cart.totalItems}
                </span>
              ) : null}
            </Link>

            {user ? (
              <Link href={accountHref} className="grid h-6 w-6 place-items-center rounded-full border border-current text-[10px] font-semibold uppercase">
                {firstName.slice(0, 1).toUpperCase()}
              </Link>
            ) : (
              <Link href="/login" className={`transition ${iconClass}`} aria-label="Login">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c1.5-4 14.5-4 16 0" />
                </svg>
              </Link>
            )}
          </div>

          {searchOpen ? (
            <form
              onSubmit={submitSearch}
              className={`absolute right-0 top-full mt-3 w-64 rounded-full border px-4 py-2 text-sm shadow-lg ${
                transparent ? "border-white/20 bg-black/70 text-white" : "border-black/10 bg-white text-neutral-900"
              }`}
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search fragrances"
                className="w-full bg-transparent text-sm outline-none placeholder:text-current/50"
              />
            </form>
          ) : null}
        </div>
      </div>
    </header>
  );
}
