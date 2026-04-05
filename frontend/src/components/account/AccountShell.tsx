"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/account", label: "Your account" },
  { href: "/account/orders", label: "Purchase history" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/settings", label: "Login & security" },
];

export function AccountShell({ children, userName, userEmail }: { children: ReactNode; userName?: string; userEmail?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initial = (userName || "R").slice(0, 1).toUpperCase();

  return (
    <main className="acct-layout">
      {/* Mobile toggle */}
      <button type="button" onClick={() => setOpen((v) => !v)} className="acct-mobile-toggle" aria-label="Toggle account menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="acct-sidebar">
        <SidebarContent pathname={pathname} initial={initial} userName={userName} userEmail={userEmail} />
      </aside>

      {/* Mobile sidebar */}
      {open ? <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="acct-sidebar-backdrop" /> : null}
      <aside className={`acct-sidebar-mobile${open ? " open" : ""}`}>
        <SidebarContent pathname={pathname} initial={initial} userName={userName} userEmail={userEmail} onNavigate={() => setOpen(false)} />
      </aside>

      <section className="acct-main">{children}</section>
    </main>
  );
}

function SidebarContent({ pathname, initial, userName, userEmail, onNavigate }: {
  pathname: string; initial: string; userName?: string; userEmail?: string; onNavigate?: () => void;
}) {
  return (
    <>
      <div className="acct-sidebar-brand">
        <div className="acct-sidebar-brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 9h10l-1 10H8L7 9Z" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></svg>
        </div>
        <div className="acct-sidebar-brand-text">
          <p>RYVEN</p>
          <p>Customer space</p>
        </div>
      </div>

      <div className="acct-sidebar-user">
        <div className="acct-sidebar-user-avatar">{initial}</div>
        <div>
          <p>{userName || "Ryven Customer"}</p>
          <p>{userEmail || "support@ryven.in"}</p>
        </div>
      </div>

      <nav className="acct-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={pathname === item.href ? "active" : ""}
          >
            <NavIcon href={item.href} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="acct-sidebar-footer">
        Support: <span>support@ryven.in</span>
      </div>
    </>
  );
}

function NavIcon({ href }: { href: string }) {
  if (href === "/account") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></svg>
  );
  if (href === "/account/orders") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /><path d="M4 5h2l2.4 9.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8L20 8H7" /></svg>
  );
  if (href === "/account/notifications") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4a4 4 0 0 0-4 4v2.5c0 .8-.2 1.5-.7 2.1L6 14.5h12l-1.3-1.9a3.6 3.6 0 0 1-.7-2.1V8a4 4 0 0 0-4-4Z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 6.5 5v5.6c0 4 2.2 7.2 5.5 8.9 3.3-1.7 5.5-4.9 5.5-8.9V5L12 3Z" /><path d="m9.8 11.8 1.5 1.5 3.2-3.3" /></svg>
  );
}
