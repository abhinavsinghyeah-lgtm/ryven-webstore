"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { CustomerDashboardResponse, OrdersListResponse } from "@/types/dashboard";

const orderActiveStatuses = ["pending", "paid", "processing", "shipped"] as const;

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
          apiRequest<OrdersListResponse>("/account/orders?page=1&limit=5", { token }),
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

  const onLogout = () => {
    authStorage.clear();
    router.push("/");
  };

  const activeOrders = useMemo(() => {
    if (!ordersData) return 0;
    return ordersData.orders.filter((order) => orderActiveStatuses.includes(order.status as (typeof orderActiveStatuses)[number])).length;
  }, [ordersData]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-8">
        <Spinner label="Loading overview..." />
      </div>
    );
  }

  if (error || !dashboard || !ordersData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Dashboard unavailable"}
      </div>
    );
  }

  const firstName = dashboard.user.fullName.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Track orders, update details, and manage your account.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/products" className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800">
            Continue shopping
          </Link>
          <Link href="/cart" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            View cart
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total Orders" value={String(dashboard.summary.totalOrders)} />
        <MetricCard label="Total Spend" value={formatPricePaise(dashboard.summary.totalSpentPaise, "INR")} />
        <MetricCard label="Active Orders" value={String(activeOrders)} />
      </section>

      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Recent orders</h2>
            <p className="mt-1 text-sm text-neutral-500">Latest purchases and delivery status.</p>
          </div>
          <Link href="/account/orders" className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800">
            View all orders
          </Link>
        </div>

        {ordersData.orders.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-600">No orders yet. Place your first order from products.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-neutral-500">
                  <th className="pb-4 pr-3 font-medium">Order</th>
                  <th className="pb-4 pr-3 font-medium">Date</th>
                  <th className="pb-4 pr-3 font-medium">Items</th>
                  <th className="pb-4 pr-3 font-medium">Status</th>
                  <th className="pb-4 pr-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.orders.map((order) => (
                  <tr key={order.id} className="border-t border-neutral-100 text-neutral-800">
                    <td className="py-4 pr-3 font-semibold">#{String(order.id).padStart(6, "0")}</td>
                    <td className="py-4 pr-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 pr-3">{order.itemCount}</td>
                    <td className="py-4 pr-3">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="py-4 pr-3 font-semibold">{formatPricePaise(order.totalPaise, order.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </article>
  );
}

function StatusPill({ status }: { status: OrdersListResponse["orders"][number]["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    processing: "bg-sky-100 text-sky-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles[status] || "bg-neutral-100 text-neutral-600"}`}>
      {status}
    </span>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-neutral-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      {label}
    </div>
  );
}
