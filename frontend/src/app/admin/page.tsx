"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
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

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }

    apiRequest<AdminDashboardResponse>("/admin/dashboard", { token })
      .then((response) => setData(response))
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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ContentSkeleton key={index} rows={3} className="min-h-[150px]" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ContentSkeleton rows={4} showAvatar={false} className="min-h-[330px]" />
            <div className="space-y-6">
              <ContentSkeleton rows={3} showAvatar={false} className="min-h-[180px]" />
              <ContentSkeleton rows={2} showAvatar={false} className="min-h-[160px]" />
            </div>
          </div>
        </div>
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
        <StatCard label="Pending Orders" value={String(data.stats.pendingOrders)} />
        <StatCard label="Active Products" value={String(data.stats.totalProducts)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard className="bg-gradient-to-r from-[#b33a30] via-[#2f574d] to-[#0d7c6a]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Hello Admin</p>
            <p className="mt-2 text-2xl font-semibold text-white">Welcome back.</p>
            <p className="mt-2 text-sm text-white/70">
              Monitor orders, track revenue, and keep the storefront healthy.
            </p>
          </div>
          <button type="button" className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900">
            Start action
          </button>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Ideas for you</p>
            <div className="flex items-center gap-2">
              <button className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-xs">‹</button>
              <button className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-xs">›</button>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">Create a product story for your next launch.</p>
          <button className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
            Read now
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
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Total income</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatPricePaise(data.stats.totalRevenuePaise, "INR")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Total expenses</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatPricePaise(data.stats.paidRevenuePaise, "INR")}
              </p>
            </div>
          </div>
          <div className="mt-6 h-48 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-full items-end gap-3">
              {[28, 42, 35, 68, 47, 60, 55, 72, 64, 76, 58, 81].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-2xl bg-emerald-400/70" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-sm font-semibold text-white">Product Sales</p>
          <div className="mt-4 flex h-48 items-center justify-center">
            <div className="h-40 w-40 rounded-full border-[18px] border-emerald-400 border-t-amber-400 border-r-cyan-400 border-b-emerald-400" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>Smartphones — ₹22,120</p>
            <p>Laptops — ₹4,510</p>
            <p>Headphones — ₹800</p>
          </div>
        </AdminCard>
      </section>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-white/5 bg-[#151c26] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">{label}</p>
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-white/40">Updated just now</p>
    </article>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[18px] border border-white/5 bg-[#151c26] p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-white/50">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-emerald-400">+2.29% ↑</p>
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
