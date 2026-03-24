"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { OrdersListResponse } from "@/types/dashboard";

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;

type StatusValue = (typeof statuses)[number];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrdersListResponse | null>(null);
  const [filter, setFilter] = useState("");

  const token = useMemo(() => authStorage.getToken(), []);

  const loadOrders = useCallback(async (status = "") => {
    if (!token) return;
    try {
      const data = await apiRequest<OrdersListResponse>(`/admin/orders?page=1&limit=50&status=${status}`, { token });
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const user = authStorage.getUser();
    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/account");
      return;
    }

    void loadOrders("");
  }, [loadOrders, router, token]);

  const changeStatus = async (orderId: number, status: StatusValue) => {
    if (!token) return;
    setError(null);
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: { status },
      });
      await loadOrders(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Order Management</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800">
          Back to dashboard
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setFilter("");
            void loadOrders("");
          }}
          className={`rounded-full px-3 py-1.5 text-sm ${filter === "" ? "bg-neutral-900 text-white" : "border border-neutral-300 text-neutral-800"}`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              void loadOrders(status);
            }}
            className={`rounded-full px-3 py-1.5 text-sm capitalize ${
              filter === status ? "bg-neutral-900 text-white" : "border border-neutral-300 text-neutral-800"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="rounded-2xl border border-neutral-300 bg-white/90 p-5">
        {loading ? (
          <p className="text-sm text-neutral-600">Loading orders...</p>
        ) : !orders || orders.orders.length === 0 ? (
          <p className="text-sm text-neutral-600">No orders found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Location</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Total</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 text-neutral-800">
                    <td className="py-3 pr-3 font-semibold">#{String(order.id).padStart(6, "0")}</td>
                    <td className="py-3 pr-3">{order.customerEmail}</td>
                    <td className="py-3 pr-3">{order.shippingCity}, {order.shippingState}</td>
                    <td className="py-3 pr-3">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 pr-3 font-semibold">{formatPricePaise(order.totalPaise, order.currency)}</td>
                    <td className="py-3 pr-3 capitalize">{order.status}</td>
                    <td className="py-3 pr-3">
                      <select
                        value={order.status}
                        onChange={(event) => void changeStatus(order.id, event.target.value as StatusValue)}
                        className="h-9 rounded-lg border border-neutral-300 px-2 text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
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
