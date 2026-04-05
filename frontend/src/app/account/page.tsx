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
    if (!token) { router.replace("/login"); return; }

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

  const onLogout = () => { authStorage.clear(); router.push("/"); };

  const activeOrders = useMemo(() => {
    if (!ordersData) return 0;
    return ordersData.orders.filter((o) => orderActiveStatuses.includes(o.status as (typeof orderActiveStatuses)[number])).length;
  }, [ordersData]);

  if (loading) {
    return <div className="acct-card"><div className="acct-spinner-wrap"><span className="acct-spinner" /><span className="acct-spinner-label">Loading overview...</span></div></div>;
  }

  if (error || !dashboard || !ordersData) {
    return <div className="acct-alert acct-alert-error">{error || "Dashboard unavailable"}</div>;
  }

  const firstName = dashboard.user.fullName.split(" ")[0] || "there";

  return (
    <div>
      <header className="acct-welcome">
        <div>
          <p className="acct-welcome-tag">Account</p>
          <h1>Welcome back, {firstName}.</h1>
          <p>Track orders, update details, and manage your account.</p>
        </div>
        <div className="acct-welcome-actions">
          <Link href="/products" className="btn btn-outline">Continue shopping</Link>
          <Link href="/cart" className="btn btn-dark">View cart</Link>
          <button type="button" onClick={onLogout} className="btn btn-outline">Logout</button>
        </div>
      </header>

      <section className="acct-metrics">
        <article className="acct-metric">
          <p className="acct-metric-label">Total Orders</p>
          <p className="acct-metric-value">{dashboard.summary.totalOrders}</p>
        </article>
        <article className="acct-metric">
          <p className="acct-metric-label">Total Spend</p>
          <p className="acct-metric-value">{formatPricePaise(dashboard.summary.totalSpentPaise, "INR")}</p>
        </article>
        <article className="acct-metric">
          <p className="acct-metric-label">Active Orders</p>
          <p className="acct-metric-value">{activeOrders}</p>
        </article>
      </section>

      <section className="acct-card">
        <div className="acct-card-header">
          <div>
            <h2>Recent orders</h2>
            <p>Latest purchases and delivery status.</p>
          </div>
          <Link href="/account/orders" className="btn btn-outline">View all orders</Link>
        </div>

        {ordersData.orders.length === 0 ? (
          <p className="acct-empty">No orders yet. Place your first order from products.</p>
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
    </div>
  );
}

function StatusPill({ status }: { status: OrdersListResponse["orders"][number]["status"] }) {
  const cls: Record<string, string> = {
    pending: "status-pending", paid: "status-paid", processing: "status-processing",
    shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
  };
  return <span className={`status-pill ${cls[status] || ""}`}>{status}</span>;
}
