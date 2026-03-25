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
        <StatCard label="Total Orders" value={String(data.stats.totalOrders)} tone="sunset" delay="40ms" />
        <StatCard label="Paid Orders" value={String(data.stats.paidOrders)} tone="mint" delay="120ms" />
        <StatCard label="Pending Orders" value={String(data.stats.pendingOrders)} tone="amber" delay="200ms" />
        <StatCard label="Active Products" value={String(data.stats.totalProducts)} tone="sky" delay="280ms" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard className="fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Revenue snapshot</p>
              <p className="mt-1 text-sm text-neutral-500">Track store health at a glance.</p>
            </div>
            <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-600">Live</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-[#fff4e8] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Total Revenue</p>
              <p className="mt-3 text-3xl font-semibold text-neutral-900">
                {formatPricePaise(data.stats.totalRevenuePaise, "INR")}
              </p>
            </div>
            <div className="rounded-3xl border border-black/5 bg-[#e9f6f0] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Paid Revenue</p>
              <p className="mt-3 text-3xl font-semibold text-neutral-900">
                {formatPricePaise(data.stats.paidRevenuePaise, "INR")}
              </p>
            </div>
          </div>

          <div className="mt-8 h-56 rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-6">
            <div className="flex h-full items-end gap-3">
              {[28, 42, 35, 68, 47, 60, 55, 72, 64, 76, 58, 81].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,#1f2937_0%,#0f172a_100%)] opacity-90 shadow-[0_8px_18px_rgba(15,23,42,0.22)]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard className="fade-up" style={{ animationDelay: "200ms" }}>
            <p className="text-sm font-semibold text-neutral-900">Quick actions</p>
            <div className="mt-4 grid gap-3">
              <QuickCard href="/admin/products" title="Add or edit products" description="Keep the catalog and hero visuals in sync." />
              <QuickCard href="/admin/orders" title="Review incoming orders" description="Track pending, paid, and processed orders." />
              <QuickCard href="/admin/settings" title="Update storefront settings" description="Control hero image, branding, and tagline." />
            </div>
          </AdminCard>

          <AdminCard className="fade-up bg-[#0f1115] text-white" style={{ animationDelay: "260ms" }}>
            <p className="text-sm font-semibold">Operations pulse</p>
            <p className="mt-3 text-4xl font-semibold">{data.stats.pendingOrders}</p>
            <p className="mt-2 text-sm text-white/70">orders waiting for action right now</p>
          </AdminCard>
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  tone,
  delay,
}: {
  label: string;
  value: string;
  tone: "sunset" | "mint" | "amber" | "sky";
  delay: string;
}) {
  const toneMap = {
    sunset: "bg-[#ffe1c7]",
    mint: "bg-[#daf4e7]",
    amber: "bg-[#ffe8b8]",
    sky: "bg-[#d8ecff]",
  };

  return (
    <article className="fade-up relative overflow-hidden rounded-[26px] border border-black/5 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]" style={{ animationDelay: delay }}>
      <div className={`absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl ${toneMap[tone]}`} />
      <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-2 text-xs text-neutral-500">Updated just now</p>
    </article>
  );
}

function QuickCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-black/5 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-black/10 hover:bg-white"
    >
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 group-hover:text-neutral-600">Open</p>
    </Link>
  );
}
