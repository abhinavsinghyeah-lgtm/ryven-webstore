"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminCard, AdminShell, StatusBanner, adminButtonClasses } from "@/components/admin/AdminShell";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { authStorage } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { NotificationsResponse, NotificationEvent } from "@/types/dashboard";

const PAGE_SIZE = 5;

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NotificationsResponse | null>(null);
  const [page, setPage] = useState(0);

  const loadPage = async (nextPage = 0) => {
    const token = authStorage.getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<NotificationsResponse>(`/admin/notifications?limit=${PAGE_SIZE}&offset=${nextPage * PAGE_SIZE}`, {
        token,
      });
      setData(response);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

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
    void loadPage(0);
  }, [router]);

  return (
    <AdminShell
      title="Notifications"
      subtitle="Live admin alerts for visits, signups, orders, cart activity, and store events."
      actions={
        <button type="button" className={adminButtonClasses.soft} onClick={() => loadPage(page)}>
          Refresh notifications
        </button>
      }
    >
      {error ? <StatusBanner tone="error" title="Notification error" description={error} /> : null}

      {loading ? (
        <AdminLoader label="Loading notifications..." />
      ) : (
        <AdminCard>
          <div className="space-y-3">
            {data?.events?.length ? (
              data.events.map((event) => (
                <NotificationRow key={`${event.type}-${event.refId}-${event.createdAt}`} event={event} />
              ))
            ) : (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/60">
                No notifications yet.
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: Math.max(1, Math.ceil((data?.pagination?.total ?? 0) / PAGE_SIZE)) }, (_, idx) => (
              <button
                key={idx}
                type="button"
                className={idx === page ? adminButtonClasses.soft : adminButtonClasses.ghost}
                onClick={() => loadPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminShell>
  );
}

function NotificationRow({ event }: { event: NotificationEvent }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">
        {event.type === "visit" && `New visitor on site`}
        {event.type === "signup" && `New user registered`}
        {event.type === "order" && `Order/payment activity`}
        {event.type === "cart" && `Abandoned or updated cart`}
      </p>
      <p className="mt-1 text-sm text-white/70">
        {event.name || event.email || event.ip || "Unknown visitor"}
        {event.email ? ` · ${event.email}` : ""}
        {event.ip ? ` · ${event.ip}` : ""}
      </p>
      <p className="mt-1 text-xs text-white/45">{new Date(event.createdAt).toLocaleString()}</p>
    </div>
  );
}
