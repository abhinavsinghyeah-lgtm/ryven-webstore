"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AdminUserDetailsResponse } from "@/types/dashboard";

function formatMoney(pricePaise: number) { return `INR ${(pricePaise / 100).toFixed(2)}`; }
function formatDate(value?: string | null) { if (!value) return "—"; return new Date(value).toLocaleString(); }

export default function AdminUserDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminUserDetailsResponse | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }

    setLoading(true); setError(null);
    apiRequest<AdminUserDetailsResponse>(`/admin/users/${params.id}`, { token })
      .then((response) => setData(response))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load user"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  return (
    <AdminShell
      title={data ? data.user.fullName : "User detail"}
      subtitle="Customer profile, order summary, and quick context for support."
      actions={<Link href="/admin/users" className={adminButtonClasses.ghost}>Back to users</Link>}
    >
      {error && <StatusBanner tone="error" title="User detail error" description={error} />}

      {loading ? <AdminLoader /> : data ? (
        <>
          <section className="adm-grid">
            <AdminCard>
              <p className="adm-header-eyebrow">Profile</p>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginTop: 8 }}>{data.user.fullName}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                <InfoCard label="Email" value={data.user.email} />
                <InfoCard label="Phone" value={data.user.phone || "—"} />
                <InfoCard label="Role" value={data.user.role} />
                <InfoCard label="Verification" value={data.user.isVerified ? "Verified" : "Pending"} />
                <InfoCard label="Password" value={data.user.isPasswordSet ? "Set" : "Not set"} />
                <InfoCard label="Joined" value={formatDate(data.user.createdAt)} />
              </div>
            </AdminCard>

            <AdminCard>
              <p className="adm-header-eyebrow">Summary</p>
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                <InfoCard label="Total orders" value={String(data.summary.totalOrders)} />
                <InfoCard label="Active orders" value={String(data.summary.activeOrders)} />
                <InfoCard label="Total spend" value={formatMoney(data.summary.totalSpentPaise)} />
                <InfoCard label="Account status" value={data.user.isActive ? "Active" : "Disabled"} />
              </div>
            </AdminCard>
          </section>

          <AdminCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <p className="adm-section-label">Recent orders</p>
              <span className="adm-badge adm-badge-gray">{data.recentOrders.length} shown</span>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {data.recentOrders.length ? data.recentOrders.map((order) => (
                <div key={order.id} style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Order #{order.id}</p>
                      <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>{order.itemCount} items · {order.status} · {formatMoney(order.totalPaise)}</p>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: ".12em" }}>{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              )) : (
                <p style={{ fontSize: 13, color: "var(--text-3)", padding: 16, border: "1px solid var(--border-light)", borderRadius: 12 }}>No orders recorded for this user yet.</p>
              )}
            </div>
          </AdminCard>
        </>
      ) : null}
    </AdminShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, border: "1px solid var(--border-light)", borderRadius: 10, background: "var(--bg)" }}>
      <p style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--text-4)", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{value}</p>
    </div>
  );
}
