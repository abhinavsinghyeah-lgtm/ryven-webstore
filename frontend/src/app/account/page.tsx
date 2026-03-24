"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { CustomerDashboardResponse, OrdersListResponse } from "@/types/dashboard";

export default function AccountDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<CustomerDashboardResponse | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersListResponse | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const run = async () => {
      try {
        const [dashboardResponse, ordersResponse] = await Promise.all([
          apiRequest<CustomerDashboardResponse>("/account/dashboard", { token }),
          apiRequest<OrdersListResponse>("/account/orders?page=1&limit=20", { token }),
        ]);

        setDashboard(dashboardResponse);
        setOrdersData(ordersResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load account data");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  if (loading) {
    return <main className="mx-auto max-w-5xl px-5 py-10 text-sm text-neutral-600">Loading dashboard...</main>;
  }

  if (error || !dashboard || !ordersData) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Dashboard unavailable"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Welcome, {dashboard.user.fullName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/products" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">
            Continue shopping
          </Link>
          <Link href="/cart" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            Open cart
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-neutral-300 bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{dashboard.summary.totalOrders}</p>
        </article>
        <article className="rounded-2xl border border-neutral-300 bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Recent Spend</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">
            {formatPricePaise(dashboard.summary.totalSpentPaise, "INR")}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-neutral-300 bg-white/90 p-5">
        <h2 className="text-lg font-semibold text-neutral-900">Your orders</h2>
        {ordersData.orders.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">No orders yet. Place your first order from products.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Items</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 text-neutral-800">
                    <td className="py-3 pr-3 font-semibold">#{String(order.id).padStart(6, "0")}</td>
                    <td className="py-3 pr-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-3">{order.itemCount}</td>
                    <td className="py-3 pr-3 capitalize">{order.status}</td>
                    <td className="py-3 pr-3 font-semibold">{formatPricePaise(order.totalPaise, order.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
