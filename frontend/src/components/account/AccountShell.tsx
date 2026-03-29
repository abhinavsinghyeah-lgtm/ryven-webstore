"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/account", label: "Your account", icon: UserIcon },
  { href: "/account/orders", label: "Purchase history", icon: CartIcon },
  { href: "/account/notifications", label: "Notifications", icon: BellIcon },
  { href: "/account/settings", label: "Login & security", icon: ShieldIcon },
];

export function AccountShell({ children, userName, userEmail }: { children: ReactNode; userName?: string; userEmail?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initial = (userName || "R").slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="flex min-h-screen w-full">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-neutral-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] lg:hidden"
          aria-label="Toggle account menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <aside
          className={`fixed inset-y-0 left-0 z-30 w-[286px] border-r border-black/5 bg-white px-5 py-5 transition-transform duration-200 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-full flex-col bg-white p-2 lg:p-3">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#dff7b2] text-neutral-900 shadow-inner">
                <BagIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.92rem] font-semibold tracking-[0.02em] text-neutral-900">RYVEN</p>
                <p className="text-[0.73rem] text-neutral-400">Customer space</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900">{userName || "Ryven Customer"}</p>
                  <p className="truncate text-xs text-neutral-500">{userEmail || "support@ryven.in"}</p>
                </div>
                <ChevronIcon className="h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <nav className="mt-5 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={
                      isActive
                        ? "flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-900 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                        : "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
                    }
                  >
                    <Icon className="h-[18px] w-[18px] text-neutral-500" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-neutral-100 pt-4 text-xs text-neutral-400">
              Support: <span className="font-medium text-neutral-600">support@ryven.in</span>
            </div>
          </div>
        </aside>

        {open ? <button type="button" aria-label="Close account menu" onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/25 lg:hidden" /> : null}

        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</section>
      </div>
    </main>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3 6.5 5v5.6c0 4 2.2 7.2 5.5 8.9 3.3-1.7 5.5-4.9 5.5-8.9V5L12 3Z" />
      <path d="m9.8 11.8 1.5 1.5 3.2-3.3" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 4a4 4 0 0 0-4 4v2.5c0 .8-.2 1.5-.7 2.1L6 14.5h12l-1.3-1.9a3.6 3.6 0 0 1-.7-2.1V8a4 4 0 0 0-4-4Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 9h10l-1 10H8L7 9Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M4 5h2l2.4 9.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
