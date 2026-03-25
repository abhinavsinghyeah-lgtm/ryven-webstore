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
    "inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
  soft:
    "inline-flex items-center justify-center rounded-full border border-black/10 bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-200",
};

export const adminInputClasses =
  "h-11 w-full rounded-xl border border-black/10 bg-white/90 px-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-black/30 focus:bg-white";

export const adminTextareaClasses =
  "w-full rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-black/30 focus:bg-white";

export function AdminShell({ title, subtitle, eyebrow = "Admin", actions, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f5f2_0%,#f0eee9_100%)] text-[#0f1115]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:gap-8 lg:py-12">
        <aside className="lg:w-72">
          <div className="space-y-5 lg:sticky lg:top-8">
            <div className="rounded-[26px] bg-[#111318] p-6 text-white shadow-[0_18px_48px_rgba(15,17,21,0.28)]">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Ryven</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">Admin Studio</p>
              <p className="mt-2 text-sm text-white/70">Operations and control.</p>

              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = isActiveRoute(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        isActive
                          ? "block rounded-2xl bg-white/12 px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                          : "block rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                      }
                    >
                      <span className="block text-[0.68rem] uppercase tracking-[0.3em] text-white/40">{item.description}</span>
                      <span className="mt-1 block text-base">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/50">Status</p>
                <p className="mt-2 text-sm text-white/90">All systems ready for action.</p>
              </div>
            </div>

            <div className="rounded-[22px] border border-black/5 bg-white p-4 shadow-sm">
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-neutral-500">Tip</p>
              <p className="mt-2 text-sm text-neutral-700">Keep hero image, products, and settings aligned so the storefront always feels premium.</p>
              <Link href="/" className="mt-4 inline-flex items-center text-sm font-semibold text-neutral-900">
                View storefront
              </Link>
            </div>
          </div>
        </aside>

        <section className="flex-1 space-y-6">
          <header className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">{eyebrow}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
                {subtitle ? <p className="mt-2 text-sm text-neutral-600 sm:text-base">{subtitle}</p> : null}
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
      className={`rounded-[24px] border border-black/5 bg-white p-6 shadow-sm ${className}`}
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
  const iconMap = {
    success: "ok",
    info: "i",
    warning: "!",
    error: "!",
  } as const;

  return (
    <div className={`status-banner status-banner--${tone}`}>
      <div className="status-banner__icon">{iconMap[tone]}</div>
      <div>
        <p className="status-banner__title">{title}</p>
        {description ? <p className="status-banner__description">{description}</p> : null}
      </div>
    </div>
  );
}
