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
    if (!token) { router.replace("/login"); return; }

    const run = async () => {
      try {
        const res = await apiRequest<AccountNotificationsResponse>("/account/notifications?limit=30&offset=0", { token });
        setNotifications(res.notifications);
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
    return <div className="acct-card"><div className="acct-spinner-wrap"><span className="acct-spinner" /><span className="acct-spinner-label">Loading notifications...</span></div></div>;
  }

  if (error) {
    return <div className="acct-alert acct-alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="acct-card" style={{ marginTop: 0 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>Notifications</h2>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Order updates, payment confirmations, cart reminders, and messages from the admin team.</p>
      </div>

      <div className="acct-card">
        {notifications.length === 0 ? (
          <p className="acct-empty" style={{ marginTop: 0 }}>No notifications yet. New updates will appear here.</p>
        ) : (
          <div>
            {notifications.map((item) => (
              <article key={item.id} className="acct-notif">
                <div className="acct-notif-row">
                  <div className="acct-notif-content">
                    <span className={`acct-notif-dot ${dotClass(item.type)}`} />
                    <div>
                      <p className="acct-notif-title">{item.title}</p>
                      <p className="acct-notif-message">{item.message}</p>
                    </div>
                  </div>
                  <span className="acct-notif-time">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function dotClass(type: string) {
  if (type === "admin_message") return "dot-admin";
  if (type === "payment") return "dot-payment";
  if (type === "abandoned_cart") return "dot-cart";
  if (type === "order") return "dot-order";
  return "dot-default";
}
