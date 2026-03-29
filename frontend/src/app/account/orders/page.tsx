"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { OrdersListResponse } from "@/types/dashboard";

export default function AccountOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersListResponse | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const run = async () => {
      try {
        const ordersResponse = await apiRequest<OrdersListResponse>("/account/orders?page=1&limit=50", { token });
        setOrdersData(ordersResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-8">
        <Spinner label="Loading orders..." />
      </div>
    );
  }

  if (error || !ordersData) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Orders unavailable"}
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">All orders</h1>
          <p className="mt-1 text-sm text-neutral-500">Track every purchase and delivery stage.</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
          {ordersData.orders.length} orders
        </span>
      </div>

      {ordersData.orders.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-600">No orders yet. Start shopping to see them here.</p>
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
