"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import type { AccountNotificationsResponse, AccountNotificationItem } from "@/types/dashboard";

export default function AccountNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AccountNotificationItem[]>([]);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const run = async () => {
      try {
        const response = await apiRequest<AccountNotificationsResponse>("/account/notifications?limit=30&offset=0", { token });
        setNotifications(response.notifications);
        await apiRequest("/account/notifications/read-all", { method: "POST", token });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load notifications");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-8">
        <Spinner label="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-semibold text-neutral-900">Notifications</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Order updates, payment confirmations, cart reminders, and messages from the admin team.
        </p>
      </header>

      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        {notifications.length === 0 ? (
          <p className="text-sm text-neutral-500">No notifications yet. New updates will appear here.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <article key={item.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${toneDot(item.type)}`} />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                      <p className="mt-1 text-sm text-neutral-600">{item.message}</p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function toneDot(type: string) {
  if (type === "admin_message") return "bg-neutral-900";
  if (type === "payment") return "bg-emerald-500";
  if (type === "abandoned_cart") return "bg-amber-500";
  if (type === "order") return "bg-sky-500";
  return "bg-neutral-400";
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-neutral-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      {label}
    </div>
  );
}
