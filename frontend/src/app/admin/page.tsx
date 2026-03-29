"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { AdminDashboardResponse, EngagementOverviewResponse, NotificationsResponse } from "@/types/dashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [engagement, setEngagement] = useState<EngagementOverviewResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }

    Promise.all([
      apiRequest<AdminDashboardResponse>("/admin/dashboard", { token }),
      apiRequest<EngagementOverviewResponse>("/admin/engagement/overview", { token }),
      apiRequest<NotificationsResponse>("/admin/notifications?limit=6", { token }),
    ])
      .then(([response, engagementResponse, notificationsResponse]) => {
        setData(response);
        setEngagement(engagementResponse);
        setNotifications(notificationsResponse);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load admin dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  const onLogout = () => {
    authStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <AdminShell title="Loading dashboard" subtitle="Fetching the latest admin metrics.">
        <AdminLoader label="Loading dashboard data..." />
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
          <Link href="/admin/products" className={adminButtonClasses.ghost}>
            Manage products
          </Link>
          <Link href="/admin/orders" className={adminButtonClasses.primary}>
            Manage orders
          </Link>
          <button type="button" onClick={onLogout} className={adminButtonClasses.soft}>
            Logout
          </button>
        </>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={String(data.stats.totalOrders)} />
        <StatCard label="Paid Orders" value={String(data.stats.paidOrders)} />
        <StatCard label="Live Visitors" value={String(engagement?.summary?.liveVisitors ?? 0)} />
        <StatCard label="Active Products" value={String(data.stats.totalProducts)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard className="bg-gradient-to-r from-[#b5362f] via-[#2f544a] to-[#0b6f60]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Hello Admin</p>
            <p className="mt-2 text-2xl font-semibold text-white">Welcome back.</p>
            <p className="mt-2 text-sm text-white/70">
              Monitor orders, track revenue, and keep the storefront healthy.
            </p>
          </div>
          <button type="button" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-neutral-900">
            Start AI
          </button>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Top page</p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              Last 7 days
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">
            {engagement?.topPages?.[0]
              ? `${engagement.topPages[0].path} — ${engagement.topPages[0].hits} visits`
              : "No page traffic yet."}
          </p>
          <button className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
            View details
          </button>
        </AdminCard>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Orders" value={String(data.stats.totalOrders)} />
        <MetricCard label="Revenue" value={formatPricePaise(data.stats.totalRevenuePaise, "INR")} />
        <MetricCard label="Conversion Rate" value="3.5%" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard>
          <p className="text-sm font-semibold text-white">Revenue</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Total revenue</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatPricePaise(data.stats.totalRevenuePaise, "INR")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Paid revenue</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatPricePaise(data.stats.paidRevenuePaise, "INR")}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">Revenue completion</p>
            <div className="mt-3 h-3 w-full rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-emerald-400"
                style={{
                  width:
                    data.stats.totalRevenuePaise > 0
                      ? `${Math.min(100, Math.round((data.stats.paidRevenuePaise / data.stats.totalRevenuePaise) * 100))}%`
                      : "0%",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-white/60">
              {data.stats.totalRevenuePaise > 0
                ? `${Math.round((data.stats.paidRevenuePaise / data.stats.totalRevenuePaise) * 100)}% captured`
                : "No revenue data yet."}
            </p>
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-sm font-semibold text-white">Order Mix</p>
          <div className="mt-4 flex h-48 items-center justify-center">
            <div
              className="h-40 w-40 rounded-full"
              style={{
                background: `conic-gradient(#10b981 0% ${Math.round(
                  data.stats.totalOrders > 0 ? (data.stats.paidOrders / data.stats.totalOrders) * 100 : 0,
                )}%,
                #f59e0b ${Math.round(
                  data.stats.totalOrders > 0 ? (data.stats.paidOrders / data.stats.totalOrders) * 100 : 0,
                )}% ${Math.round(
                  data.stats.totalOrders > 0 ? ((data.stats.paidOrders + data.stats.pendingOrders) / data.stats.totalOrders) * 100 : 0,
                )}%,
                #3b82f6 ${Math.round(
                  data.stats.totalOrders > 0 ? ((data.stats.paidOrders + data.stats.pendingOrders) / data.stats.totalOrders) * 100 : 0,
                )}% 100%)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#151c26] text-sm text-white">
                {data.stats.totalOrders}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>Paid — {data.stats.paidOrders}</p>
            <p>Pending — {data.stats.pendingOrders}</p>
            <p>Other — {Math.max(0, data.stats.totalOrders - data.stats.paidOrders - data.stats.pendingOrders)}</p>
          </div>
        </AdminCard>
      </section>

      <AdminCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Notifications</p>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Latest events</span>
        </div>
        <div className="mt-4 space-y-3">
          {notifications?.events?.length ? (
            notifications.events.map((event) => (
              <div key={`${event.type}-${event.refId}-${event.createdAt}`} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-white">
                  {event.type === "visit" && `New visit from ${event.ip || "Unknown IP"}`}
                  {event.type === "signup" && `New signup: ${event.email || event.name}`}
                  {event.type === "order" && `New order placed by ${event.email || event.name}`}
                  {event.type === "cart" && `Cart updated by ${event.email || event.name}`}
                </p>
                <p className="mt-1 text-xs text-white/50">{new Date(event.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No notifications yet.</p>
          )}
        </div>
      </AdminCard>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-white/5 bg-[#151c26] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">⦿</span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/40">Updated just now</p>
    </article>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-white/5 bg-[#151c26] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70">⦿</span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/50">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-emerald-400">+2.29% ↑</p>
    </article>
  );
}

function QuickCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/20"
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-white/65">{description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/40 group-hover:text-white/70">Open</p>
    </Link>
  );
}
