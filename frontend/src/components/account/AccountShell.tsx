"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/settings", label: "Account settings" },
];

export function AccountShell({ children, userName, userEmail }: { children: ReactNode; userName?: string; userEmail?: string }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="flex min-h-screen w-full">
        <aside className="w-[300px] shrink-0 border-r border-black/5 bg-white px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-900 text-white">
              {(userName || "R").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{userName || "Account"}</p>
              <p className="text-xs text-neutral-500">{userEmail || "ryven.in"}</p>
            </div>
          </div>

          <div className="mt-8 text-[0.7rem] uppercase tracking-[0.28em] text-neutral-400">Dashboard</div>
          <nav className="mt-3 space-y-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "flex items-center gap-3 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
                    : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                }
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-100 text-xs text-neutral-500">•</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 text-[0.7rem] uppercase tracking-[0.28em] text-neutral-400">Account</div>
          <div className="mt-3 rounded-2xl border border-black/5 bg-neutral-50 p-4 text-sm text-neutral-600">
            Need help? Reach out at <span className="font-semibold text-neutral-900">support@ryven.in</span>
          </div>
        </aside>

        <section className="flex-1 px-10 py-10">{children}</section>
      </div>
    </main>
  );
}
