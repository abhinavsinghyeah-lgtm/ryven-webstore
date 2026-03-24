"use client";

import Link from "next/link";
import { useState } from "react";

import { authStorage } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

export function SiteHeader() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return authStorage.getUser();
  });

  const onLogout = () => {
    authStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-300/70 bg-[#f1f1ee]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-bold tracking-[0.22em] text-neutral-900 uppercase">
            RYVEN
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/products" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
              Collections
            </Link>
            <Link href="/about" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
              About
            </Link>
            <Link href="/checkout" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
              Checkout
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="rounded-full border border-neutral-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-800 sm:text-sm">
            Cart
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                className="rounded-full border border-neutral-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-800 sm:text-sm"
              >
                {user.role === "admin" ? "Admin" : "Account"}
              </Link>
              <button
                onClick={onLogout}
                className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-neutral-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-800 sm:text-sm">
                Login
              </Link>
              <Link href="/signup" className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
