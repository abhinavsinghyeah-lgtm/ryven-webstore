"use client";

import Link from "next/link";
import { ReactNode, CSSProperties } from "react";
import { usePathname } from "next/navigation";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard", description: "Overview & KPIs" },
  { href: "/admin/control", label: "Control", description: "Systems & logs" },
  { href: "/admin/engagement", label: "Engagement", description: "Live activity" },
  { href: "/admin/users", label: "Users", description: "Accounts & access" },
  { href: "/admin/products", label: "Products", description: "Catalog & pricing" },
  { href: "/admin/orders", label: "Orders", description: "Fulfillment flow" },
  { href: "/admin/settings", label: "Settings", description: "Brand + hero" },
];

const isActiveRoute = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === "/admin") return pathname === href;
  return pathname.startsWith(href);
};

export const adminButtonClasses = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
  soft:
    "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15",
};

export const adminInputClasses =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white shadow-sm outline-none transition focus:border-white/30 focus:bg-white/10";

export const adminTextareaClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-white/30 focus:bg-white/10";

export function AdminShell({ title, subtitle, eyebrow = "Admin", actions, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#0f131a] text-slate-100">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-6 py-8 lg:px-8">
        <aside className="hidden w-[260px] flex-shrink-0 lg:block">
          <div className="flex h-full flex-col rounded-[20px] border border-white/5 bg-[#111821] p-6 shadow-[0_20px_60px_rgba(6,10,16,0.6)]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <span className="text-lg font-semibold">R</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ryven</p>
                <p className="text-xs text-white/50">Admin Studio</p>
              </div>
            </div>

            <div className="mt-8 text-[0.68rem] uppercase tracking-[0.32em] text-white/40">Pages</div>
            <nav className="mt-4 space-y-1">
              {navItems.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white"
                        : "flex items-center justify-between rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    }
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-white/40">{item.description}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">Status</p>
              <p className="mt-2 text-sm text-white/80">All systems ready for action.</p>
            </div>
          </div>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-white/5 bg-[#111821] px-4 py-3 shadow-[0_18px_40px_rgba(6,10,16,0.45)]">
            <div className="flex items-center gap-3 text-white/70">
              <span className="text-xs uppercase tracking-[0.28em]">Dashboard</span>
              <span className="text-xs text-white/40">|</span>
              <span className="text-xs uppercase tracking-[0.28em]">{eyebrow}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 md:flex">
                <span>Search</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">⌘K</span>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-xs text-white/70">🔔</div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white">A</div>
            </div>
          </div>

          <header className="rounded-[20px] border border-white/5 bg-[#151c26] p-6 shadow-[0_18px_40px_rgba(6,10,16,0.45)]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">{eyebrow}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
                {subtitle ? <p className="mt-2 text-sm text-white/65 sm:text-base">{subtitle}</p> : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>
          </header>

          <div className="space-y-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function AdminCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={`rounded-[20px] border border-white/5 bg-[#151c26] p-6 text-white shadow-[0_16px_32px_rgba(6,10,16,0.45)] ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

export function StatusBanner({
  tone = "info",
  title,
  description,
}: {
  tone?: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
}) {
  const toneMap: Record<typeof tone, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-100",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneMap[tone]}`}>
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
    </div>
  );
}
