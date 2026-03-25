"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { authStorage } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isPastHero, setIsPastHero] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => {
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

  const onLogout = () => {
    authStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  const transparent = isHome && !isPastHero;

  const headerClass = transparent
    ? "fixed top-0 z-50 w-full border-transparent bg-transparent text-white"
    : "sticky top-0 z-50 border-b border-neutral-300 bg-white/96 text-neutral-900 backdrop-blur-lg";

  const subtleLinkClass = transparent
    ? "text-sm text-white/90 hover:text-white transition-colors"
    : "text-sm text-neutral-700 hover:text-neutral-900 transition-colors";

  const ghostBtnClass = transparent
    ? "rounded-full border border-white/55 bg-transparent px-3 py-1.5 text-xs font-medium text-white sm:text-sm hover:bg-white/20 transition-all"
    : "rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 sm:text-sm hover:bg-neutral-100 transition-all";

  const solidBtnClass = transparent
    ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 sm:text-sm hover:shadow-lg transition-all"
    : "rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm hover:shadow-md transition-all";

  return (
    <header className={headerClass}>
      <div className="mx-auto w-full max-w-6xl px-5 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-bold tracking-[0.22em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
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
          <Link href="/checkout" className={ghostBtnClass}>
            Checkout
          </Link>
          <Link href="/cart" className={ghostBtnClass}>
            Cart
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                className={ghostBtnClass}
              >
                {user.role === "admin" ? "Admin" : "Account"}
              </Link>
              <button
                onClick={onLogout}
                className={solidBtnClass}
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
