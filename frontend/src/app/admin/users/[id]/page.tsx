"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AdminUserDetailsResponse } from "@/types/dashboard";

function formatMoney(pricePaise: number) {
  return `INR ${(pricePaise / 100).toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function AdminUserDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminUserDetailsResponse | null>(null);

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

    setLoading(true);
    setError(null);
    apiRequest<AdminUserDetailsResponse>(`/admin/users/${params.id}`, { token })
      .then((response) => setData(response))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load user"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  return (
    <AdminShell
      title={data ? data.user.fullName : "User detail"}
      subtitle="Customer profile, order summary, and quick context for support or product investigation."
      actions={
        <Link href="/admin/users" className={adminButtonClasses.ghost}>
          Back to users
        </Link>
      }
    >
      {error ? <StatusBanner tone="error" title="User detail error" description={error} /> : null}

      {loading ? (
        <AdminLoader label="Loading user profile..." />
      ) : data ? (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminCard>
              <p className="text-xs uppercase tracking-[0.26em] text-white/40">Profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{data.user.fullName}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoCard label="Email" value={data.user.email} />
                <InfoCard label="Phone" value={data.user.phone || "—"} />
                <InfoCard label="Role" value={data.user.role} />
                <InfoCard label="Verification" value={data.user.isVerified ? "Verified" : "Pending"} />
                <InfoCard label="Password" value={data.user.isPasswordSet ? "Set" : "Not set"} />
                <InfoCard label="Joined" value={formatDate(data.user.createdAt)} />
              </div>
            </AdminCard>

            <AdminCard>
              <p className="text-xs uppercase tracking-[0.26em] text-white/40">Summary</p>
              <div className="mt-5 grid gap-4">
                <InfoCard label="Total orders" value={String(data.summary.totalOrders)} />
                <InfoCard label="Active orders" value={String(data.summary.activeOrders)} />
                <InfoCard label="Spend" value={formatMoney(data.summary.totalSpentPaise)} />
                <InfoCard label="Account status" value={data.user.isActive ? "Active" : "Disabled"} />
              </div>
            </AdminCard>
          </section>

          <AdminCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Recent orders</p>
                <p className="mt-1 text-sm text-white/60">Latest customer activity tied to this account.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/55">
                {data.recentOrders.length} shown
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {data.recentOrders.length ? (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Order #{order.id}</p>
                        <p className="mt-1 text-sm text-white/60">
                          {order.itemCount} items · {order.status} · {formatMoney(order.totalPaise)}
                        </p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/35">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4 text-sm text-white/55">
                  No orders recorded for this user yet.
                </div>
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
    <div className="rounded-[18px] border border-white/6 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
