"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader } from "@/components/admin/AdminShell";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { AdminDashboardResponse } from "@/types/dashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminDashboardResponse | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }

    apiRequest<AdminDashboardResponse>("/admin/dashboard", { token })
      .then((res) => setData(res))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load admin dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  const onLogout = () => { authStorage.clear(); router.push("/"); };

  if (loading) {
    return (
      <AdminShell title="Loading dashboard" subtitle="Fetching the latest admin metrics.">
        <AdminLoader />
      </AdminShell>
    );
  }

  if (error || !data) {
    return (
      <AdminShell title="Dashboard unavailable" subtitle="We hit a snag loading your admin data.">
        <StatusBanner tone="error" title="Could not load dashboard" description={error || "Dashboard unavailable"} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Store Command"
      subtitle="A crisp overview of revenue, orders, and catalog health."
      actions={
        <>
          <Link href="/admin/products" className="admin-btn admin-btn-ghost">Manage products</Link>
          <Link href="/admin/orders" className="admin-btn admin-btn-primary">Manage orders</Link>
          <button type="button" onClick={onLogout} className="admin-btn admin-btn-soft">Logout</button>
        </>
      }
    >
      {/* Stat cards */}
      <section className="admin-stats">
        <div className="admin-stat fade-up" style={{ animationDelay: "40ms" }}>
          <div className="admin-stat-glow glow-sunset" />
          <p className="admin-stat-label">Total Orders</p>
          <p className="admin-stat-value">{data.stats.totalOrders}</p>
          <p className="admin-stat-sub">Updated just now</p>
        </div>
        <div className="admin-stat fade-up" style={{ animationDelay: "120ms" }}>
          <div className="admin-stat-glow glow-mint" />
          <p className="admin-stat-label">Paid Orders</p>
          <p className="admin-stat-value">{data.stats.paidOrders}</p>
          <p className="admin-stat-sub">Updated just now</p>
        </div>
        <div className="admin-stat fade-up" style={{ animationDelay: "200ms" }}>
          <div className="admin-stat-glow glow-amber" />
          <p className="admin-stat-label">Pending Orders</p>
          <p className="admin-stat-value">{data.stats.pendingOrders}</p>
          <p className="admin-stat-sub">Updated just now</p>
        </div>
        <div className="admin-stat fade-up" style={{ animationDelay: "280ms" }}>
          <div className="admin-stat-glow glow-sky" />
          <p className="admin-stat-label">Active Products</p>
          <p className="admin-stat-value">{data.stats.totalProducts}</p>
          <p className="admin-stat-sub">Updated just now</p>
        </div>
      </section>

      {/* Revenue + Quick actions */}
      <section className="admin-content-grid">
        <AdminCard className="fade-up" style={{ animationDelay: "120ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p className="admin-revenue-label">Revenue snapshot</p>
              <p className="admin-revenue-sub">Track store health at a glance.</p>
            </div>
            <span className="admin-live-badge">Live</span>
          </div>

          <div className="admin-revenue-boxes">
            <div className="admin-revenue-box box-total">
              <p>Total Revenue</p>
              <p>{formatPricePaise(data.stats.totalRevenuePaise, "INR")}</p>
            </div>
            <div className="admin-revenue-box box-paid">
              <p>Paid Revenue</p>
              <p>{formatPricePaise(data.stats.paidRevenuePaise, "INR")}</p>
            </div>
          </div>

          <div className="admin-chart">
            {[28, 42, 35, 68, 47, 60, 55, 72, 64, 76, 58, 81].map((h, i) => (
              <div key={i} className="admin-chart-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </AdminCard>

        <div>
          <AdminCard className="fade-up" style={{ animationDelay: "200ms" }}>
            <p className="admin-quick-title">Quick actions</p>
            <div className="admin-quick-grid">
              <Link href="/admin/products" className="admin-quick-card">
                <p>Add or edit products</p>
                <p>Keep the catalog and hero visuals in sync.</p>
                <p>Open</p>
              </Link>
              <Link href="/admin/orders" className="admin-quick-card">
                <p>Review incoming orders</p>
                <p>Track pending, paid, and processed orders.</p>
                <p>Open</p>
              </Link>
              <Link href="/admin/settings" className="admin-quick-card">
                <p>Update storefront settings</p>
                <p>Control hero image, branding, and tagline.</p>
                <p>Open</p>
              </Link>
            </div>
          </AdminCard>

          <div className="admin-pulse fade-up" style={{ animationDelay: "260ms" }}>
            <p className="admin-pulse-label">Operations pulse</p>
            <p className="admin-pulse-value">{data.stats.pendingOrders}</p>
            <p className="admin-pulse-sub">orders waiting for action right now</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
