"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, AdminLoader, adminButtonClasses } from "@/components/admin/AdminShell";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { NotificationsResponse, NotificationEvent } from "@/types/dashboard";

const PAGE_SIZE = 5;

const typeLabel: Record<string, string> = {
  visit: "New visitor on site",
  signup: "New user registered",
  order: "Order / payment activity",
  cart: "Abandoned or updated cart",
};

const typeBadge: Record<string, string> = {
  visit: "adm-badge adm-badge-blue",
  signup: "adm-badge adm-badge-green",
  order: "adm-badge adm-badge-pop",
  cart: "adm-badge adm-badge-amber",
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [page, setPage] = useState(0);

  const loadPage = async (nextPage = 0) => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const response = await apiRequest<NotificationsResponse>(`/admin/notifications?limit=${PAGE_SIZE}&offset=${nextPage * PAGE_SIZE}`, { token });
      setData(response); setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!token || !user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/account"); return; }
    void loadPage(0);
  }, [router]);

  return (
    <AdminShell
      title="Notifications"
      subtitle="Live admin alerts for visits, signups, orders, cart activity, and store events."
      actions={<button type="button" className={adminButtonClasses.soft} onClick={() => loadPage(page)}>Refresh</button>}
    >
      {error && <StatusBanner tone="error" title="Notification error" description={error} />}

      {loading ? <AdminLoader /> : (
        <AdminCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data?.events?.length ? data.events.map((event) => (
              <div key={`${event.type}-${event.refId}-${event.createdAt}`} style={{ padding: 16, border: "1px solid var(--border-light)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={typeBadge[event.type] || "adm-badge adm-badge-gray"}>{event.type}</span>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{typeLabel[event.type] || event.type}</p>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6 }}>
                    {event.name || event.email || event.ip || "Unknown visitor"}
                    {event.email ? ` · ${event.email}` : ""}
                    {event.ip ? ` · ${event.ip}` : ""}
                  </p>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: ".12em" }}>{new Date(event.createdAt).toLocaleString()}</p>
              </div>
            )) : (
              <div className="adm-empty">
                <p>🔔</p>
                <p>No notifications yet</p>
                <p>Activity will appear here as events occur.</p>
              </div>
            )}
          </div>

          {(data?.pagination?.total ?? 0) > PAGE_SIZE && (
            <div className="adm-pagination" style={{ marginTop: 20 }}>
              {Array.from({ length: Math.ceil((data?.pagination?.total ?? 0) / PAGE_SIZE) }, (_, idx) => (
                <button key={idx} type="button" className={`adm-page-btn${idx === page ? " active" : ""}`} onClick={() => loadPage(idx)}>{idx + 1}</button>
              ))}
            </div>
          )}
        </AdminCard>
      )}
    </AdminShell>
  );
}
