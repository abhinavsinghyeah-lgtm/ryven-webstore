"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/contexts/CartContext";
import { authStorage } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

export function SiteHeader() {
  const pathname = usePathname();
  const { cart } = useCart();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");
  const [isPastHero, setIsPastHero] = useState(false);
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

  const transparent = isHome && !isPastHero;
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "Account";
  const accountHref = user?.role === "admin" ? "/admin" : "/account";

  const headerClass = transparent
    ? "fixed top-0 z-50 w-full border-transparent bg-transparent text-white"
    : isAdmin
      ? "sticky top-0 z-50 w-full border-b border-black/5 bg-[#f7f5f2] text-neutral-900"
      : "sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 text-neutral-900 backdrop-blur-lg";

  const subtleLinkClass = transparent
    ? "text-[0.8rem] uppercase tracking-[0.22em] text-white/85 hover:text-white transition-colors"
    : "text-[0.8rem] uppercase tracking-[0.22em] text-neutral-600 hover:text-neutral-900 transition-colors";

  const ghostBtnClass = transparent
    ? "rounded-full border border-white/40 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
    : "rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 transition hover:border-black/20";

  const solidBtnClass = transparent
    ? "rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900 shadow-sm transition hover:shadow-md"
    : "rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-neutral-800";

  const iconLinkClass = transparent
    ? "inline-flex h-10 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
    : "inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-900 transition hover:border-black/20";

  const cartLinkClass = transparent
    ? "inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 px-3 text-white transition hover:bg-white/20"
    : "inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-neutral-900 transition hover:border-black/20";

  const logoClass = transparent
    ? "font-display text-lg font-semibold uppercase tracking-[0.32em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
    : "font-display text-lg font-semibold uppercase tracking-[0.32em]";

  return (
    <header className={headerClass}>
      <div className="mx-auto w-full max-w-6xl px-5 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link href="/" className={logoClass}>
            RYVEN
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
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
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/cart" className={cartLinkClass} aria-label="Open cart">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7" />
                  <circle cx="10" cy="19" r="1.5" />
                  <circle cx="17" cy="19" r="1.5" />
                </svg>
                <span className="text-xs font-semibold">{cart.totalItems}</span>
              </Link>

              <Link href={accountHref} className={iconLinkClass}>
                <span className={transparent ? "grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-semibold uppercase text-neutral-900" : "grid h-6 w-6 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold uppercase text-white"}>
                  {firstName.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{firstName}</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/cart" className={cartLinkClass} aria-label="Open cart">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7" />
                  <circle cx="10" cy="19" r="1.5" />
                  <circle cx="17" cy="19" r="1.5" />
                </svg>
                <span className="text-xs font-semibold">{cart.totalItems}</span>
              </Link>
              <Link href="/login" className={ghostBtnClass}>
                Login
              </Link>
              <Link href="/signup" className={solidBtnClass}>
                Create account
              </Link>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
