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
    if (!token) { router.replace("/login"); return; }

    const run = async () => {
      try {
        const res = await apiRequest<OrdersListResponse>("/account/orders?page=1&limit=50", { token });
        setOrdersData(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [router]);

  if (loading) {
    return <div className="acct-card"><div className="acct-spinner-wrap"><span className="acct-spinner" /><span className="acct-spinner-label">Loading orders...</span></div></div>;
  }

  if (error || !ordersData) {
    return <div className="acct-alert acct-alert-error">{error || "Orders unavailable"}</div>;
  }

  return (
    <section className="acct-card" style={{ marginTop: 0 }}>
      <div className="acct-card-header">
        <div>
          <h2>All orders</h2>
          <p>Track every purchase and delivery stage.</p>
        </div>
        <span className="acct-badge">{ordersData.orders.length} orders</span>
      </div>

      {ordersData.orders.length === 0 ? (
        <p className="acct-empty">No orders yet. Start shopping to see them here.</p>
      ) : (
        <div className="acct-table-wrap">
          <table className="acct-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{String(order.id).padStart(6, "0")}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.itemCount}</td>
                  <td><StatusPill status={order.status} /></td>
                  <td className="order-total">{formatPricePaise(order.totalPaise, order.currency)}</td>
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
  const cls: Record<string, string> = {
    pending: "status-pending", paid: "status-paid", processing: "status-processing",
    shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
  };
  return <span className={`status-pill ${cls[status] || ""}`}>{status}</span>;
}
