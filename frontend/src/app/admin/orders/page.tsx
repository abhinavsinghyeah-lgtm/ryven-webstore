"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
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

  const loadOrders = useCallback(async (status = "") => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<OrdersListResponse>(`/admin/orders?page=1&limit=50&status=${status}`, { token });
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

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

    void loadOrders("");
  }, [loadOrders, router]);

  const changeStatus = async (orderId: number, status: StatusValue) => {
    const token = authStorage.getToken();
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
    <AdminShell
      title="Order Operations"
      subtitle="Track fulfillment, update statuses, and keep customers informed."
      actions={
        <Link href="/admin" className={adminButtonClasses.ghost}>
          Back to dashboard
        </Link>
      }
    >
      {error ? <StatusBanner tone="error" title="Order feed error" description={error} /> : null}

      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">Filters</p>
            <p className="mt-2 text-sm text-white/60">
              {orders ? `${orders.orders.length} orders loaded` : "Choose a view to load orders."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <FilterChip active={filter === ""} onClick={() => {
            setFilter("");
            void loadOrders("");
          }}>
            All
          </FilterChip>
          {statuses.map((status) => (
            <FilterChip
              key={status}
              active={filter === status}
              onClick={() => {
                setFilter(status);
                void loadOrders(status);
              }}
            >
              {status}
            </FilterChip>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        {loading ? (
          <p className="text-sm text-white/60">Loading orders...</p>
        ) : !orders || orders.orders.length === 0 ? (
          <p className="text-sm text-white/60">No orders found for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.24em] text-white/50">
                  <th className="py-3 pr-4 font-medium">Order</th>
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Location</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 text-white/85">
                    <td className="py-4 pr-4 font-semibold">#{String(order.id).padStart(6, "0")}</td>
                    <td className="py-4 pr-4">{order.customerEmail}</td>
                    <td className="py-4 pr-4">
                      {order.shippingCity}, {order.shippingState}
                    </td>
                    <td className="py-4 pr-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-4 pr-4 font-semibold text-white">{formatPricePaise(order.totalPaise, order.currency)}</td>
                    <td className="py-4 pr-4">
                      <StatusPill status={order.status as StatusValue} />
                    </td>
                    <td className="py-4 pr-4">
                      <select
                        value={order.status}
                        onChange={(event) => void changeStatus(order.id, event.target.value as StatusValue)}
                        className="h-10 rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white shadow-sm outline-none focus:border-white/30"
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
      </AdminCard>
    </AdminShell>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_20px_rgba(16,185,129,0.25)]"
          : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/10"
      }
    >
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: StatusValue }) {
  const toneMap: Record<StatusValue, string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    processing: "bg-sky-100 text-sky-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-lime-100 text-lime-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneMap[status]}`}>
      {status}
    </span>
  );
}
