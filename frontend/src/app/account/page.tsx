"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ContentSkeleton } from "@/components/ui/ContentSkeleton";
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

  const onLogout = () => {
    authStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6ff] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
          <ContentSkeleton rows={4} className="min-h-[760px]" />
          <div className="space-y-6">
            <ContentSkeleton rows={3} showAvatar={false} className="min-h-[96px]" />
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ContentSkeleton key={index} rows={3} className="min-h-[150px]" />
              ))}
            </div>
            <ContentSkeleton rows={4} showAvatar={false} className="min-h-[420px]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !dashboard || !ordersData) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Dashboard unavailable"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6ff] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <p className="text-lg font-bold text-neutral-900">Dashboard</p>
          <p className="mt-1 text-sm text-neutral-500">Hello {dashboard.user.fullName.split(" ")[0]} 👋</p>

          <nav className="mt-8 space-y-2">
            <SidebarItem label="Dashboard" active />
            <SidebarItem label="Orders" />
            <SidebarItem label="Products" />
            <SidebarItem label="Support" />
          </nav>

          <div className="mt-10 rounded-3xl bg-[linear-gradient(135deg,#8b5cf6_0%,#6366f1_100%)] p-4 text-white">
            <p className="text-sm font-semibold">Keep shopping</p>
            <p className="mt-2 text-sm text-white/85">Explore the latest additions and reorder your favourites fast.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5b43f4]">Visit Products</Link>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Account</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">Welcome, {dashboard.user.fullName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/products" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">Continue shopping</Link>
              <Link href="/cart" className="rounded-full bg-[#5b43f4] px-4 py-2 text-sm font-semibold text-white">Open cart</Link>
              <button type="button" onClick={onLogout} className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">Logout</button>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-3">
            <AccountMetric label="Total Orders" value={String(dashboard.summary.totalOrders)} accent="bg-emerald-100 text-emerald-700" />
            <AccountMetric label="Total Spend" value={formatPricePaise(dashboard.summary.totalSpentPaise, "INR")} accent="bg-violet-100 text-violet-700" />
            <AccountMetric label="Active Orders" value={String(ordersData.orders.filter((order) => ["pending", "paid", "processing", "shipped"].includes(order.status)).length)} accent="bg-sky-100 text-sky-700" />
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">All Orders</h2>
                <p className="mt-1 text-sm text-neutral-500">Recent purchases and delivery status</p>
              </div>
              <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600">{ordersData.orders.length} orders</div>
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
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "delivered" ? "bg-emerald-100 text-emerald-700" : order.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-violet-100 text-violet-700"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 pr-3 font-semibold">{formatPricePaise(order.totalPaise, order.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function SidebarItem({ label, active = false }: { label: string; active?: boolean }) {
  return <div className={active ? "rounded-2xl bg-[#5b43f4] px-4 py-3 text-sm font-semibold text-white" : "rounded-2xl px-4 py-3 text-sm font-medium text-neutral-500"}>{label}</div>;
}

function AccountMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <article className="rounded-[1.7rem] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-semibold ${accent}`}>●</div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </article>
  );
}
