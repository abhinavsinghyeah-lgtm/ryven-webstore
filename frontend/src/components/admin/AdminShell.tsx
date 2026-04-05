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
  primary: "admin-btn admin-btn-primary",
  ghost: "admin-btn admin-btn-ghost",
  soft: "admin-btn admin-btn-soft",
};

export const adminInputClasses = "admin-input";
export const adminTextareaClasses = "admin-textarea";

export function AdminShell({ title, subtitle, eyebrow = "Admin", actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return navItems.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query)).slice(0, 5);
  }, [search]);

  const logout = () => { authStorage.clear(); router.push("/"); };

  const sidebarContent = (onNav?: () => void) => (
    <>
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-icon">R</div>
        <div>
          <p>Ryven</p>
          <p>Admin Studio</p>
        </div>
      </div>

      <div className="admin-sidebar-label">Pages</div>
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={isActiveRoute(pathname, item.href) ? "active" : ""} onClick={onNav}>
            <span className="nav-dot">●</span>
            <div>
              <span>{item.label}</span>
              <span>{item.description}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-status">
        <p>Status</p>
        <p>All systems ready for action.</p>
      </div>
    </>
  );

  return (
    <main className="admin-layout">
      {/* Mobile toggle */}
      <button type="button" className="admin-mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle admin menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar">{sidebarContent()}</aside>

      {/* Mobile sidebar */}
      {mobileOpen ? <button type="button" aria-label="Close" onClick={() => setMobileOpen(false)} className="admin-sidebar-backdrop" /> : null}
      <aside className={`admin-sidebar-mobile${mobileOpen ? " open" : ""}`}>{sidebarContent(() => setMobileOpen(false))}</aside>

      <section className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <Link href="/" className="admin-topbar-home">
            <span>🏠</span>
            Home
          </Link>
          <div className="admin-topbar-right">
            <div style={{ position: "relative" }}>
              <form
                className="admin-search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = results[0]?.href || "/admin";
                  setSearch("");
                  router.push(target);
                }}
              >
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
                <span className="admin-search-kbd">⌘K</span>
              </form>
              {results.length ? (
                <div className="admin-search-results">
                  {results.map((item) => (
                    <button key={item.href} type="button" onClick={() => { setSearch(""); router.push(item.href); }}>
                      <span>{item.label}</span>
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href="/admin/notifications" className="admin-profile-btn" style={{ background: "rgba(255,255,255,.06)", fontSize: 12 }} aria-label="Notifications">🔔</Link>
            <div style={{ position: "relative" }}>
              <button type="button" className="admin-profile-btn" onClick={() => setProfileOpen((v) => !v)} aria-label="Profile">A</button>
              {profileOpen ? (
                <div className="admin-profile-dropdown">
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)}>Settings</Link>
                  <Link href="/" onClick={() => setProfileOpen(false)}>View storefront</Link>
                  <button type="button" onClick={logout} style={{ color: "#fda4af" }}>Logout</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="admin-header">
          <p className="admin-header-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
          {actions ? <div className="admin-header-actions">{actions}</div> : null}
        </div>

        {/* Content */}
        <div style={{ marginTop: 24 }}>{children}</div>
      </section>
    </main>
  );
}

export function AdminCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <section className={`admin-card ${className}`} style={style}>{children}</section>;
}

export function StatusBanner({ tone = "info", title, description }: { tone?: "success" | "info" | "warning" | "error"; title: string; description?: string }) {
  const colors: Record<string, { bg: string; border: string; color: string }> = {
    success: { bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.25)", color: "#a7f3d0" },
    info: { bg: "rgba(14,165,233,.1)", border: "rgba(14,165,233,.25)", color: "#bae6fd" },
    warning: { bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)", color: "#fde68a" },
    error: { bg: "rgba(244,63,94,.1)", border: "rgba(244,63,94,.25)", color: "#fecdd3" },
  };
  const c = colors[tone] || colors.info;
  return (
    <div style={{ padding: "12px 16px", borderRadius: 14, background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 14 }}>
      <p style={{ fontWeight: 600 }}>{title}</p>
      {description ? <p style={{ marginTop: 4, opacity: .8 }}>{description}</p> : null}
    </div>
  );
}

export function AdminLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "40px 0" }}>
      <span className="acct-spinner" style={{ borderColor: "rgba(255,255,255,.15)", borderTopColor: "#fff" }} />
      <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>Loading...</span>
    </div>
  );
}
