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
    ? "fixed top-0 z-50 w-full border-transparent bg-transparent text-neutral-700"
    : "sticky top-0 z-50 border-b border-neutral-200 bg-white/80 text-neutral-800 backdrop-blur-lg";

  const subtleLinkClass = transparent
    ? "text-sm text-neutral-600/90 hover:text-neutral-700 transition-colors"
    : "text-sm text-neutral-600 hover:text-neutral-800 transition-colors";

  const ghostBtnClass = transparent
    ? "rounded-full border border-neutral-400/50 bg-white/20 px-3 py-1.5 text-xs font-medium text-neutral-700 sm:text-sm hover:bg-white/30 transition-all"
    : "rounded-full border border-neutral-300 bg-white/60 px-3 py-1.5 text-xs font-medium text-neutral-700 sm:text-sm hover:bg-white transition-all";

  const solidBtnClass = transparent
    ? "rounded-full bg-gradient-to-r from-pink-300 to-purple-300 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm hover:shadow-lg transition-all"
    : "rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm hover:shadow-md transition-all";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-bold tracking-[0.22em] uppercase">
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
    </header>
  );
}
