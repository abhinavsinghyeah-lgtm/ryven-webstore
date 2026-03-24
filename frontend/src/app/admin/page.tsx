"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (loading) return <main className="mx-auto max-w-6xl px-5 py-10 text-sm text-neutral-600">Loading admin dashboard...</main>;

  if (error || !data) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Dashboard unavailable"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Store Control Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">
            Manage products
          </Link>
          <Link href="/admin/orders" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            Manage orders
          </Link>
          <Link href="/admin/settings" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900">
            Store settings
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Total Orders" value={String(data.stats.totalOrders)} />
        <Metric label="Paid Orders" value={String(data.stats.paidOrders)} />
        <Metric label="Pending Orders" value={String(data.stats.pendingOrders)} />
        <Metric label="Total Revenue" value={formatPricePaise(data.stats.totalRevenuePaise, "INR")} />
        <Metric label="Paid Revenue" value={formatPricePaise(data.stats.paidRevenuePaise, "INR")} />
        <Metric label="Active Products" value={String(data.stats.totalProducts)} />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-neutral-300 bg-white/80 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </article>
  );
}
