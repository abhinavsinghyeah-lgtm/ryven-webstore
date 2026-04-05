"use client";

import Link from "next/link";
import React, { ReactNode, CSSProperties, useMemo, useState } from "react";
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
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Products", icon: "box" },
  { href: "/admin/orders", label: "Orders", icon: "truck" },
  { href: "/admin/users", label: "Customers", icon: "users" },
  { href: "/admin/engagement", label: "Analytics", icon: "chart" },
  { href: "/admin/notifications", label: "Activity", icon: "bell" },
  { href: "/admin/control", label: "Control", icon: "shield" },
  { href: "/admin/system", label: "System", icon: "server" },
  { href: "/admin/settings", label: "Settings", icon: "gear" },
];

const NAV_ICONS: Record<string, React.ReactElement> = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  box: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 3H1v13h15V3z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  server: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

const isActiveRoute = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  if (href === "/admin") return pathname === href;
  return pathname.startsWith(href);
};

export const adminButtonClasses = {
  primary: "adm-btn adm-btn-primary",
  ghost: "adm-btn adm-btn-ghost",
  soft: "adm-btn adm-btn-soft",
  danger: "adm-btn adm-btn-danger",
};

export const adminInputClasses = "adm-input";
export const adminTextareaClasses = "adm-textarea";

export function AdminShell({ title, subtitle, eyebrow = "Admin", actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return navItems.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 5);
  }, [search]);

  const logout = () => { authStorage.clear(); router.push("/"); };

  const sidebarContent = (onNav?: () => void) => (
    <>
      <div className="adm-sidebar-brand">
        <span className="adm-sidebar-logo">R</span>
        <div>
          <p className="adm-sidebar-name">RYVEN</p>
          <p className="adm-sidebar-role">Admin Studio</p>
        </div>
      </div>

      <nav className="adm-sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`adm-nav-item${isActiveRoute(pathname, item.href) ? " active" : ""}`} onClick={onNav}>
            <span className="adm-nav-icon">{NAV_ICONS[item.icon]}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="adm-sidebar-footer">
        <Link href="/" className="adm-nav-item">
          <span className="adm-nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
          </span>
          <span>Back to store</span>
        </Link>
      </div>
    </>
  );

  return (
    <main className="adm-layout">
      {/* Mobile toggle */}
      <button type="button" className="adm-mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="adm-sidebar">{sidebarContent()}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && <button type="button" aria-label="Close" onClick={() => setMobileOpen(false)} className="adm-sidebar-backdrop" />}
      <aside className={`adm-sidebar-mobile${mobileOpen ? " open" : ""}`}>{sidebarContent(() => setMobileOpen(false))}</aside>

      <section className="adm-main">
        {/* Top bar */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <div className="adm-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = results[0]?.href || "/admin";
                    setSearch("");
                    router.push(target);
                  }
                }}
              />
              {results.length > 0 && (
                <div className="adm-search-results">
                  {results.map((item) => (
                    <button key={item.href} type="button" onClick={() => { setSearch(""); router.push(item.href); }}>
                      <span className="adm-nav-icon">{NAV_ICONS[item.icon]}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="adm-topbar-right">
            <Link href="/admin/notifications" className="adm-topbar-icon" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            </Link>
            <div style={{ position: "relative" }}>
              <button type="button" className="adm-topbar-avatar" onClick={() => setProfileOpen((v) => !v)} aria-label="Profile">A</button>
              {profileOpen && (
                <div className="adm-profile-dropdown">
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)}>Settings</Link>
                  <Link href="/" onClick={() => setProfileOpen(false)}>View store</Link>
                  <button type="button" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="adm-header">
          <div>
            <p className="adm-header-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {subtitle && <p className="adm-header-sub">{subtitle}</p>}
          </div>
          {actions && <div className="adm-header-actions">{actions}</div>}
        </div>

        {/* Content */}
        <div className="adm-content">{children}</div>
      </section>
    </main>
  );
}

export function AdminCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <section className={`adm-card ${className}`} style={style}>{children}</section>;
}

export function StatusBanner({ tone = "info", title, description }: { tone?: "success" | "info" | "warning" | "error"; title: string; description?: string }) {
  return (
    <div className={`adm-banner adm-banner-${tone}`}>
      <p className="adm-banner-title">{title}</p>
      {description && <p className="adm-banner-desc">{description}</p>}
    </div>
  );
}

export function AdminLoader() {
  return (
    <div className="adm-loader">
      <span className="adm-spinner" />
      <span>Loading...</span>
    </div>
  );
}
