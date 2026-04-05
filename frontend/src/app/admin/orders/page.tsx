"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { formatPricePaise } from "@/lib/format";
import type { OrdersListResponse } from "@/types/dashboard";

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
type StatusValue = (typeof statuses)[number];

const statusBadge: Record<StatusValue, string> = {
  pending: "adm-badge adm-badge-amber",
  paid: "adm-badge adm-badge-green",
  processing: "adm-badge adm-badge-blue",
  shipped: "adm-badge adm-badge-blue",
  delivered: "adm-badge adm-badge-green",
  cancelled: "adm-badge adm-badge-red",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrdersListResponse | null>(null);
  const [filter, setFilter] = useState("");

  const loadOrders = useCallback(async (status = "") => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true); setError(null);
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
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }
    void loadOrders("");
  }, [loadOrders, router]);

  const changeStatus = async (orderId: number, status: StatusValue) => {
    const token = authStorage.getToken();
    if (!token) return;
    setError(null);
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, { method: "PATCH", token, body: { status } });
      await loadOrders(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  };

  return (
    <AdminShell
      title="Order Operations"
      subtitle="Track fulfillment, update statuses, and keep customers informed."
      actions={<Link href="/admin" className={adminButtonClasses.ghost}>Back to dashboard</Link>}
    >
      {error && <StatusBanner tone="error" title="Order feed error" description={error} />}

      <AdminCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="adm-section-label">Filters</p>
            <p className="adm-section-sub">{orders ? `${orders.orders.length} orders loaded` : "Choose a view to load orders."}</p>
          </div>
        </div>
        <div className="adm-tabs" style={{ marginTop: 16 }}>
          <button type="button" className={`adm-tab${filter === "" ? " active" : ""}`} onClick={() => { setFilter(""); void loadOrders(""); }}>All</button>
          {statuses.map((s) => (
            <button key={s} type="button" className={`adm-tab${filter === s ? " active" : ""}`} onClick={() => { setFilter(s); void loadOrders(s); }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </AdminCard>

      {loading ? <AdminLoader /> : !orders || orders.orders.length === 0 ? (
        <div className="adm-empty">
          <p>📋</p>
          <p>No orders found</p>
          <p>Try a different filter or wait for incoming orders.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{String(order.id).padStart(6, "0")}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.shippingCity}, {order.shippingState}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{formatPricePaise(order.totalPaise, order.currency)}</td>
                  <td><span className={statusBadge[order.status as StatusValue] || "adm-badge adm-badge-gray"}>{order.status}</span></td>
                  <td>
                    <select className="adm-select" value={order.status} onChange={(e) => void changeStatus(order.id, e.target.value as StatusValue)}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
