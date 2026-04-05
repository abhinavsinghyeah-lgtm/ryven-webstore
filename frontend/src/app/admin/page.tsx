"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
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
          <Link href="/admin/products" className={adminButtonClasses.ghost}>Manage products</Link>
          <Link href="/admin/orders" className={adminButtonClasses.primary}>Manage orders</Link>
        </>
      }
    >
      {/* Stat cards */}
      <section className="adm-stats">
        <div className="adm-stat fade-up" style={{ animationDelay: "40ms" }}>
          <p className="adm-stat-label">Total Orders</p>
          <p className="adm-stat-value">{data.stats.totalOrders}</p>
          <p className="adm-stat-sub">Updated just now</p>
        </div>
        <div className="adm-stat fade-up" style={{ animationDelay: "120ms" }}>
          <p className="adm-stat-label">Paid Orders</p>
          <p className="adm-stat-value">{data.stats.paidOrders}</p>
          <p className="adm-stat-sub">Updated just now</p>
        </div>
        <div className="adm-stat fade-up" style={{ animationDelay: "200ms" }}>
          <p className="adm-stat-label">Pending Orders</p>
          <p className="adm-stat-value">{data.stats.pendingOrders}</p>
          <p className="adm-stat-sub">Updated just now</p>
        </div>
        <div className="adm-stat fade-up" style={{ animationDelay: "280ms" }}>
          <p className="adm-stat-label">Active Products</p>
          <p className="adm-stat-value">{data.stats.totalProducts}</p>
          <p className="adm-stat-sub">Updated just now</p>
        </div>
      </section>

      {/* Revenue + Quick actions */}
      <section className="adm-grid">
        <AdminCard className="fade-up" style={{ animationDelay: "120ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p className="adm-section-label">Revenue snapshot</p>
              <p className="adm-section-sub">Track store health at a glance.</p>
            </div>
            <span className="adm-badge adm-badge-green"><span className="adm-live-dot" style={{ marginRight: 6 }} /> Live</span>
          </div>

          <div className="adm-revenue-boxes">
            <div className="adm-revenue-box box-total">
              <p className="adm-revenue-box-label">Total Revenue</p>
              <p className="adm-revenue-box-value">{formatPricePaise(data.stats.totalRevenuePaise, "INR")}</p>
            </div>
            <div className="adm-revenue-box box-paid">
              <p className="adm-revenue-box-label">Paid Revenue</p>
              <p className="adm-revenue-box-value">{formatPricePaise(data.stats.paidRevenuePaise, "INR")}</p>
            </div>
          </div>

          <div className="adm-chart">
            {[28, 42, 35, 68, 47, 60, 55, 72, 64, 76, 58, 81].map((h, i) => (
              <div key={i} className="adm-chart-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </AdminCard>

        <div>
          <AdminCard className="fade-up" style={{ animationDelay: "200ms" }}>
            <p className="adm-section-label">Quick actions</p>
            <div className="adm-quick-grid">
              <Link href="/admin/products" className="adm-quick-card">
                <p className="adm-quick-card-title">Add or edit products</p>
                <p className="adm-quick-card-desc">Keep the catalog and hero visuals in sync.</p>
                <span className="adm-quick-card-link">Open →</span>
              </Link>
              <Link href="/admin/orders" className="adm-quick-card">
                <p className="adm-quick-card-title">Review incoming orders</p>
                <p className="adm-quick-card-desc">Track pending, paid, and processed orders.</p>
                <span className="adm-quick-card-link">Open →</span>
              </Link>
              <Link href="/admin/settings" className="adm-quick-card">
                <p className="adm-quick-card-title">Update storefront settings</p>
                <p className="adm-quick-card-desc">Control hero image, branding, and tagline.</p>
                <span className="adm-quick-card-link">Open →</span>
              </Link>
            </div>
          </AdminCard>

          <div className="adm-pulse fade-up" style={{ animationDelay: "260ms" }}>
            <p className="adm-pulse-label">Operations pulse</p>
            <p className="adm-pulse-value">{data.stats.pendingOrders}</p>
            <p className="adm-pulse-sub">orders waiting for action right now</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
