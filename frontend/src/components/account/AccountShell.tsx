"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/account", label: "Overview", icon: GridIcon },
  { href: "/account/orders", label: "Orders", icon: BagIcon },
  { href: "/account/settings", label: "Settings", icon: SlidersIcon },
];

export function AccountShell({ children, userName, userEmail }: { children: ReactNode; userName?: string; userEmail?: string }) {
  const pathname = usePathname();
  const initial = (userName || "R").slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="flex min-h-screen w-full">
        <aside className="flex w-[248px] shrink-0 flex-col border-r border-black/5 bg-white px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
              </div>
              <div>
                <p className="text-[0.95rem] font-semibold tracking-tight text-neutral-900">Ryven</p>
                <p className="text-[0.72rem] text-neutral-400">Personal account</p>
              </div>
            </div>
            <SearchIcon className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-full border border-neutral-200 bg-neutral-50 p-1">
            <button
              type="button"
              className="rounded-full bg-neutral-900 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white"
            >
              Personal
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-neutral-400"
            >
              Orders
            </button>
          </div>

          <div className="mt-7 text-[0.68rem] uppercase tracking-[0.28em] text-neutral-400">Workspace</div>
          <nav className="mt-3 space-y-1 text-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-2xl bg-neutral-900 px-3.5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]"
                    : "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                }
              >
                <span className={isActive ? "grid h-9 w-9 place-items-center rounded-xl bg-white/10" : "grid h-9 w-9 place-items-center rounded-xl bg-neutral-100"}>
                  <Icon className={isActive ? "h-[18px] w-[18px] text-white" : "h-[18px] w-[18px] text-neutral-500"} />
                </span>
                {item.label}
              </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <div className="text-[0.68rem] uppercase tracking-[0.28em] text-neutral-400">Account</div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-neutral-500">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100">
                  <BellIcon className="h-[18px] w-[18px] text-neutral-500" />
                </span>
                Notifications
                <span className="ml-auto rounded-full bg-neutral-900 px-2 py-0.5 text-[0.68rem] font-semibold text-white">2</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-neutral-500">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100">
                  <MailIcon className="h-[18px] w-[18px] text-neutral-500" />
                </span>
                Support
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-[28px] border border-neutral-200 bg-neutral-50 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">{userName || "Ryven Customer"}</p>
                <p className="truncate text-xs text-neutral-400">{userEmail || "support@ryven.in"}</p>
              </div>
              <span className="text-neutral-300">•••</span>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-8 py-8 xl:px-10">{children}</section>
      </div>
    </main>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
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

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
      <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="17" r="2" fill="currentColor" stroke="none" />
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}
