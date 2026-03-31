"use client";

import Link from "next/link";
import { ReactNode, CSSProperties, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth";

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
  { href: "/admin/system", label: "System", description: "VPS & service health" },
  { href: "/admin/engagement", label: "Engagement", description: "Live activity" },
  { href: "/admin/notifications", label: "Notifications", description: "Events & alerts" },
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
    "inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
  soft:
    "inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15",
};

export const adminInputClasses =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white shadow-sm outline-none transition focus:border-white/30 focus:bg-white/10";

export const adminTextareaClasses =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-white/30 focus:bg-white/10";

export function AdminShell({ title, subtitle, eyebrow = "Admin", actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return navItems.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query)).slice(0, 5);
  }, [search]);

  const logout = () => {
    authStorage.clear();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#0b111a] text-slate-100">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r border-white/5 bg-[#111821] px-5 py-6 lg:flex">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
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
                      ? "flex cursor-pointer items-center gap-3 rounded-xl bg-[#1a2432] px-3 py-2 text-sm font-semibold text-white"
                      : "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  }
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-[10px] text-white/70">
                    ●
                  </span>
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-white/40">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">Status</p>
            <p className="mt-2 text-sm text-white/80">All systems ready for action.</p>
          </div>
        </aside>

        <section className="flex-1 px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#111821] px-4 py-3 shadow-[0_16px_32px_rgba(6,10,16,0.45)]">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5">🏠</span>
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const target = results[0]?.href || "/admin";
                    setSearch("");
                    router.push(target);
                  }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"
                >
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search"
                    className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                  />
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">⌘K</span>
                </form>
                {results.length ? (
                  <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-2xl border border-white/10 bg-[#151c26] p-2 shadow-[0_24px_50px_rgba(6,10,16,0.5)]">
                    {results.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        className="flex w-full cursor-pointer items-start rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        onClick={() => {
                          setSearch("");
                          router.push(item.href);
                        }}
                      >
                        <span>
                          <span className="block text-sm font-semibold text-white">{item.label}</span>
                          <span className="block text-xs text-white/50">{item.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link
                href="/admin/notifications"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-xs text-white/70 transition hover:border-white/20 hover:text-white"
                aria-label="Open notifications"
              >
                🔔
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/10 text-xs font-semibold text-white"
                  aria-label="Open profile menu"
                >
                  A
                </button>
                {profileOpen ? (
                  <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border border-white/10 bg-[#151c26] p-2 shadow-[0_24px_50px_rgba(6,10,16,0.5)]">
                    <Link
                      href="/admin/settings"
                      className="block cursor-pointer rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/"
                      className="block cursor-pointer rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      View storefront
                    </Link>
                    <button
                      type="button"
                      className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm text-rose-200 transition hover:bg-rose-500/10"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-white/65 sm:text-base">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>

          <div className="mt-6 space-y-6">{children}</div>
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
      className={`rounded-[18px] border border-white/5 bg-[#151c26] p-6 text-white shadow-[0_16px_32px_rgba(6,10,16,0.45)] ${className}`}
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
