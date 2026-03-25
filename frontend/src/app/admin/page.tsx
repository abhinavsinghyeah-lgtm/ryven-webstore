"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
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
      <main className="min-h-screen bg-[#f5f7ff] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
          <ContentSkeleton rows={4} className="min-h-[760px]" />
          <div className="space-y-6">
            <ContentSkeleton rows={3} showAvatar={false} className="min-h-[110px]" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ContentSkeleton key={index} rows={3} className="min-h-[160px]" />
              ))}
            </div>
            <ContentSkeleton rows={4} showAvatar={false} className="min-h-[340px]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Dashboard unavailable"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7ff] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-[2rem] bg-[#335cff] p-6 text-white shadow-[0_24px_80px_rgba(51,92,255,0.25)]">
          <p className="text-lg font-bold tracking-[0.16em]">RYVEN</p>
          <p className="mt-2 text-sm text-white/75">Admin Workspace</p>

          <nav className="mt-8 space-y-2">
            <NavItem href="/admin" label="Dashboard" active />
            <NavItem href="/admin/products" label="Products" />
            <NavItem href="/admin/orders" label="Orders" />
            <NavItem href="/admin/settings" label="Settings" />
          </nav>

          <div className="mt-10 rounded-3xl bg-white/14 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Quick tip</p>
            <p className="mt-2 text-sm leading-6 text-white/90">Keep hero image, products, and settings updated from one place so the storefront stays consistent.</p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">Store Control Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/products" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">Manage products</Link>
              <Link href="/admin/orders" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">Manage orders</Link>
              <button type="button" onClick={onLogout} className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">Logout</button>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total Orders" value={String(data.stats.totalOrders)} accent="bg-violet-100 text-violet-700" />
            <Metric label="Paid Orders" value={String(data.stats.paidOrders)} accent="bg-emerald-100 text-emerald-700" />
            <Metric label="Pending Orders" value={String(data.stats.pendingOrders)} accent="bg-amber-100 text-amber-700" />
            <Metric label="Active Products" value={String(data.stats.totalProducts)} accent="bg-sky-100 text-sky-700" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Revenue snapshot</p>
                  <p className="mt-1 text-sm text-neutral-500">Track store health at a glance</p>
                </div>
                <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">Live</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#f7f8ff] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Total Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900">{formatPricePaise(data.stats.totalRevenuePaise, "INR")}</p>
                </div>
                <div className="rounded-3xl bg-[#f4fbf8] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Paid Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900">{formatPricePaise(data.stats.paidRevenuePaise, "INR")}</p>
                </div>
              </div>

              <div className="mt-8 h-56 rounded-[1.5rem] bg-[linear-gradient(180deg,#eef2ff_0%,#ffffff_100%)] p-6">
                <div className="flex h-full items-end gap-3">
                  {[28, 42, 35, 68, 47, 60, 55, 72, 64, 76, 58, 81].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-2xl bg-[#335cff]/85" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                <p className="text-sm font-semibold text-neutral-900">Quick actions</p>
                <div className="mt-4 grid gap-3">
                  <QuickCard href="/admin/products" title="Add or edit products" description="Maintain live catalog and hero-linked product visuals." />
                  <QuickCard href="/admin/orders" title="Review incoming orders" description="Track pending, paid, and processed orders." />
                  <QuickCard href="/admin/settings" title="Update storefront settings" description="Control hero image, branding, and tagline instantly." />
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#111827] p-6 text-white shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
                <p className="text-sm font-semibold">Operations pulse</p>
                <p className="mt-3 text-4xl font-semibold">{data.stats.pendingOrders}</p>
                <p className="mt-2 text-sm text-white/70">orders waiting for action right now</p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function NavItem({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={active ? "block rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#335cff]" : "block rounded-2xl px-4 py-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"}
    >
      {label}
    </Link>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <article className="rounded-[1.7rem] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-semibold ${accent}`}>●</div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </article>
  );
}

function QuickCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
    </Link>
  );
}
